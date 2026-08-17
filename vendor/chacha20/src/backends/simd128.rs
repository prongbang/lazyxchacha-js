//! WebAssembly SIMD128 backend: a lane-for-lane port of `sse2.rs` (both ISAs
//! are 128-bit, four u32 lanes), processing four blocks per call. Unlike x86,
//! there is no runtime dispatch: with `+simd128` off this module is not
//! compiled, and with it on the module cannot run on a non-SIMD engine at all.
//!
//! Intrinsic mapping (x86 `_mm_set_*` takes lanes high-to-low, wasm
//! constructors take them low-to-high, hence the reversed arguments):
//!   _mm_add_epi32        -> u32x4_add
//!   _mm_add_epi64        -> u64x2_add
//!   _mm_xor_si128        -> v128_xor
//!   _mm_slli/srli_epi32  -> u32x4_shl / u32x4_shr
//!   _mm_shuffle_epi32    -> i32x4_shuffle (same lane indices, listed forward)
//!   _mm_set_epi32(0,0,0,n) -> u32x4(n,0,0,0)
//!   _mm_set_epi64x(0,n)    -> u64x2(n,0)

use crate::{Rounds, STATE_WORDS, Variant, chacha::Block};
use cipher::{
    BlockSizeUser, ParBlocksSizeUser, StreamCipherBackend, StreamCipherClosure,
    consts::{U4, U64},
};
use core::arch::wasm32::*;
use core::marker::PhantomData;

const PAR_BLOCKS: usize = 4;

#[inline]
pub(crate) fn inner<R, F, V>(state: &mut [u32; STATE_WORDS], f: F)
where
    R: Rounds,
    F: StreamCipherClosure<BlockSize = U64>,
    V: Variant,
{
    let state_ptr = state.as_ptr().cast::<v128>();
    let mut backend = Backend::<R, V> {
        // SAFETY: `state` is 16 u32s, exactly four 16-byte v128 loads;
        // v128_load allows unaligned pointers.
        v: unsafe {
            [
                v128_load(state_ptr.add(0)),
                v128_load(state_ptr.add(1)),
                v128_load(state_ptr.add(2)),
                v128_load(state_ptr.add(3)),
            ]
        },
        _pd: PhantomData,
    };

    f.call(&mut backend);

    state[12] = u32x4_extract_lane::<0>(backend.v[3]);
    if size_of::<V::Counter>() == 8 {
        state[13] = u32x4_extract_lane::<1>(backend.v[3]);
    }
}

struct Backend<R: Rounds, V: Variant> {
    v: [v128; 4],
    _pd: PhantomData<(R, V)>,
}

impl<R: Rounds, V: Variant> BlockSizeUser for Backend<R, V> {
    type BlockSize = U64;
}

impl<R: Rounds, V: Variant> ParBlocksSizeUser for Backend<R, V> {
    type ParBlocksSize = U4;
}

impl<R: Rounds, V: Variant> StreamCipherBackend for Backend<R, V> {
    #[inline(always)]
    fn gen_ks_block(&mut self, block: &mut Block) {
        let res = rounds::<R, V>(&self.v);
        self.v[3] = match size_of::<V::Counter>() {
            4 => u32x4_add(self.v[3], u32x4(1, 0, 0, 0)),
            8 => u64x2_add(self.v[3], u64x2(1, 0)),
            _ => unreachable!(),
        };

        let block_ptr = block.as_mut_ptr().cast::<v128>();
        for i in 0..4 {
            // SAFETY: a Block is 64 bytes, exactly four v128 stores.
            unsafe { v128_store(block_ptr.add(i), res[0][i]) };
        }
    }

    #[inline(always)]
    fn gen_par_ks_blocks(&mut self, blocks: &mut cipher::ParBlocks<Self>) {
        let res = rounds::<R, V>(&self.v);
        self.v[3] = match size_of::<V::Counter>() {
            4 => u32x4_add(self.v[3], u32x4(PAR_BLOCKS as u32, 0, 0, 0)),
            8 => u64x2_add(self.v[3], u64x2(PAR_BLOCKS as u64, 0)),
            _ => unreachable!(),
        };

        let blocks_ptr = blocks.as_mut_ptr().cast::<v128>();
        for block in 0..PAR_BLOCKS {
            for i in 0..4 {
                // SAFETY: ParBlocks is 4 * 64 bytes, exactly sixteen v128 stores.
                unsafe { v128_store(blocks_ptr.add(i + block * PAR_BLOCKS), res[block][i]) };
            }
        }
    }
}

#[inline]
fn rounds<R: Rounds, V: Variant>(v: &[v128; 4]) -> [[v128; 4]; PAR_BLOCKS] {
    let mut res = [*v; 4];
    for block in 1..PAR_BLOCKS {
        res[block][3] = match size_of::<V::Counter>() {
            4 => u32x4_add(res[block][3], u32x4(block as u32, 0, 0, 0)),
            8 => u64x2_add(res[block][3], u64x2(block as u64, 0)),
            _ => unreachable!(),
        }
    }

    for _ in 0..R::COUNT {
        double_quarter_round(&mut res);
    }

    for block in 0..PAR_BLOCKS {
        for i in 0..3 {
            res[block][i] = u32x4_add(res[block][i], v[i]);
        }
        let ctr = match size_of::<V::Counter>() {
            4 => u32x4_add(v[3], u32x4(block as u32, 0, 0, 0)),
            8 => u64x2_add(v[3], u64x2(block as u64, 0)),
            _ => unreachable!(),
        };
        res[block][3] = u32x4_add(res[block][3], ctr);
    }

    res
}

#[inline]
fn double_quarter_round(v: &mut [[v128; 4]; PAR_BLOCKS]) {
    add_xor_rot(v);
    rows_to_cols(v);
    add_xor_rot(v);
    cols_to_rows(v);
}

/// See `sse2.rs` for the layout rationale: `b` is left in place and the other
/// three rows are rotated so the diagonal round becomes a column round.
#[inline]
fn rows_to_cols(blocks: &mut [[v128; 4]; PAR_BLOCKS]) {
    for [a, _, c, d] in blocks.iter_mut() {
        // c >>>= 32; d >>>= 64; a >>>= 96;
        *c = i32x4_shuffle::<1, 2, 3, 0>(*c, *c);
        *d = i32x4_shuffle::<2, 3, 0, 1>(*d, *d);
        *a = i32x4_shuffle::<3, 0, 1, 2>(*a, *a);
    }
}

/// Inverse of [`rows_to_cols`].
#[inline]
fn cols_to_rows(blocks: &mut [[v128; 4]; PAR_BLOCKS]) {
    for [a, _, c, d] in blocks.iter_mut() {
        // c <<<= 32; d <<<= 64; a <<<= 96;
        *c = i32x4_shuffle::<3, 0, 1, 2>(*c, *c);
        *d = i32x4_shuffle::<2, 3, 0, 1>(*d, *d);
        *a = i32x4_shuffle::<1, 2, 3, 0>(*a, *a);
    }
}

#[inline]
fn add_xor_rot(blocks: &mut [[v128; 4]; PAR_BLOCKS]) {
    for [a, b, c, d] in blocks.iter_mut() {
        // a += b; d ^= a; d <<<= (16, 16, 16, 16);
        // Rotates stay shl+shr+xor: a one-shuffle i8x16 byte-rotate measured
        // 30% *slower* here (V8/ARM64 lowers the generic shuffle poorly).
        *a = u32x4_add(*a, *b);
        *d = v128_xor(*d, *a);
        *d = v128_xor(u32x4_shl(*d, 16), u32x4_shr(*d, 16));

        // c += d; b ^= c; b <<<= (12, 12, 12, 12);
        *c = u32x4_add(*c, *d);
        *b = v128_xor(*b, *c);
        *b = v128_xor(u32x4_shl(*b, 12), u32x4_shr(*b, 20));

        // a += b; d ^= a; d <<<= (8, 8, 8, 8);
        *a = u32x4_add(*a, *b);
        *d = v128_xor(*d, *a);
        *d = v128_xor(u32x4_shl(*d, 8), u32x4_shr(*d, 24));

        // c += d; b ^= c; b <<<= (7, 7, 7, 7);
        *c = u32x4_add(*c, *d);
        *b = v128_xor(*b, *c);
        *b = v128_xor(u32x4_shl(*b, 7), u32x4_shr(*b, 25));
    }
}
