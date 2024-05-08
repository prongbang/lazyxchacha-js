/* tslint:disable */
/* eslint-disable */
/**
* @param {string} text
* @returns {Uint8Array}
*/
export function decode(text: string): Uint8Array;
/**
* @param {Uint8Array} byte
* @returns {string}
*/
export function encode(byte: Uint8Array): string;
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
