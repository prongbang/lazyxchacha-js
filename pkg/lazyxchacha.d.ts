/* tslint:disable */
/* eslint-disable */
/**
* @param {string} text
* @returns {Uint8Array}
*/
export function from_hex(text: string): Uint8Array;
/**
* @param {Uint8Array} byte
* @returns {string}
*/
export function to_hex(byte: Uint8Array): string;
/**
* @param {string} plaintext
* @param {string} key
* @returns {string}
*/
export function encrypt(plaintext: string, key: string): string;
/**
* @param {string} ciphertext
* @param {string} key
* @returns {string}
*/
export function decrypt(ciphertext: string, key: string): string;
/**
* @param {string} pk
* @param {string} sk
* @returns {string}
*/
export function shared_key(pk: string, sk: string): string;
/**
* @returns {KeyPair}
*/
export function new_keypair(): KeyPair;
/**
*/
export class KeyPair {
  free(): void;
/**
*/
  pk: string;
/**
*/
  sk: string;
}
