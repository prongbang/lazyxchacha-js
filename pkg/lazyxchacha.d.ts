/* tslint:disable */
/* eslint-disable */
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
* @returns {string}
*/
export function hello(): string;
/**
*/
export class LazyXChaCha {
  free(): void;
}
