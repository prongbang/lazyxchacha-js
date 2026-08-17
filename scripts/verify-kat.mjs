// Known-answer test. A plain roundtrip cannot catch a keystream that diverges
// from spec — a broken cipher decrypts its own output just fine. This fixed
// ciphertext was produced by the upstream scalar backend; decrypting it proves
// the current build (e.g. the vendored simd128 backend) generates the same
// keystream, and the Poly1305 tag check fails loudly on any single-bit drift.
// 300 bytes of body so the 4-block (256-byte) parallel path is exercised.
import { decrypt_raw } from '../pkg/node/lazyxchacha.js';

const key = '3d1f8e5c0a7b46293d1f8e5c0a7b46293d1f8e5c0a7b46293d1f8e5c0a7b4629';
const ct =
  'f092c22df935b762eaa023a89b1853242bc27a1fc91d52a8ebb306372354677337afd5f7756d1f7209f9d8d688f0328d' +
  'd0086e4802880517f6acd5cddd37dbd0c62b46a6a46361625c90ccabcbfc2887fbf9fc5b3ae91d44d25d47382fc2cd47' +
  'b94c3077cf0395be63a6c25954a0b1a2b867dd4dd6ff340b9803aee35d028a586272cc7622cb6199c2401677f4560fe3' +
  '5b9fd369245b89796a328d7c9b036b63b865bfb201b27ab0230504d2ad3b07757a5c99c3169a9009f65e5efd218c868f' +
  'c842c7ac079077e0bce6af400340c2fc943aa673308d9a1e071d423e89895d3720b7e301d23fa6ba0b0a2323aff42a85' +
  '47666946ef77d8b0a3b424445b383158f004892825df1032ff4a31a7635a4ae4fb762b4a2ca24b430ac198e50692cfd4' +
  '8ee8f960f70abfdff4a1bbd60310abf895c68f6a9647f8505616a74ef01e9fd484db0d9a203c2f9c26cbcda564fc48e2' +
  '16f5fb07';

const expected = new Uint8Array(300);
for (let i = 0; i < 300; i++) expected[i] = (i * 7 + 13) & 0xff;

const pt = decrypt_raw(new Uint8Array(Buffer.from(ct, 'hex')), key);
if (Buffer.compare(Buffer.from(pt), Buffer.from(expected)) !== 0) {
  console.error('FAIL: known-answer decrypt mismatch — keystream diverges from spec');
  process.exit(1);
}

// A tampered byte must be rejected, not silently accepted.
const bad = new Uint8Array(Buffer.from(ct, 'hex'));
bad[40] ^= 1;
if (decrypt_raw(bad, key).length !== 0) {
  console.error('FAIL: tampered ciphertext was not rejected');
  process.exit(1);
}

console.log('ok: known-answer vector decrypts, tampering rejected');
