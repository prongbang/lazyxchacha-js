/* tslint:disable */
/* eslint-disable */

export class KeyPair {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    pk: string;
    sk: string;
}

export function decrypt(ciphertext: string, key: string): string;

export function decrypt_bytes(ciphertext: Uint8Array, key: string): string;

export function decrypt_raw(ciphertext: Uint8Array, key: string): Uint8Array;

export function encrypt(plaintext: string, key: string): string;

export function encrypt_bytes(plaintext: string, key: string): Uint8Array;

export function encrypt_raw(plaintext: Uint8Array, key: string): Uint8Array;

export function from_hex(text: string): Uint8Array;

export function new_keypair(): KeyPair;

export function shared_key(pk: string, sk: string): string;

export function to_hex(byte: Uint8Array): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_get_keypair_pk: (a: number) => [number, number];
    readonly __wbg_get_keypair_sk: (a: number) => [number, number];
    readonly __wbg_keypair_free: (a: number, b: number) => void;
    readonly __wbg_set_keypair_pk: (a: number, b: number, c: number) => void;
    readonly __wbg_set_keypair_sk: (a: number, b: number, c: number) => void;
    readonly decrypt: (a: number, b: number, c: number, d: number) => [number, number];
    readonly decrypt_bytes: (a: number, b: number, c: number, d: number) => [number, number];
    readonly decrypt_raw: (a: number, b: number, c: number, d: number) => [number, number];
    readonly encrypt: (a: number, b: number, c: number, d: number) => [number, number];
    readonly encrypt_bytes: (a: number, b: number, c: number, d: number) => [number, number];
    readonly encrypt_raw: (a: number, b: number, c: number, d: number) => [number, number];
    readonly from_hex: (a: number, b: number) => [number, number];
    readonly new_keypair: () => number;
    readonly shared_key: (a: number, b: number, c: number, d: number) => [number, number];
    readonly to_hex: (a: number, b: number) => [number, number];
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
