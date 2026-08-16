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
