use chacha20poly1305::{
    aead::{Aead, AeadCore, KeyInit, OsRng},
    XChaCha20Poly1305,
};
use chacha20poly1305::aead::generic_array::GenericArray;
use crate::hex;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn encrypt(plaintext: &str, key: &str) -> String {
    let key = hex::from_hex(key);
    let key = GenericArray::from_slice(key.as_slice());
    let cipher = XChaCha20Poly1305::new(key);

    let nonce = XChaCha20Poly1305::generate_nonce(&mut OsRng);
    let ciphertext = cipher.encrypt(&nonce, plaintext.as_ref()).unwrap_or(Vec::new());
    let mut combined = Vec::<u8>::with_capacity(nonce.len() + ciphertext.len());
    combined.extend_from_slice(&nonce);
    combined.extend_from_slice(&ciphertext);

    hex::to_hex(combined)
}

#[wasm_bindgen]
pub fn decrypt(ciphertext: &str, key: &str) -> String {
    let key = hex::from_hex(key);
    let key = GenericArray::from_slice(key.as_slice());
    let cipher = XChaCha20Poly1305::new(key);

    let ciphertext = hex::from_hex(ciphertext);
    let nonce = &ciphertext[0..24];
    let nonce = GenericArray::from_slice(nonce);
    let ciphertext = &ciphertext[24..];
    let plaintext = cipher.decrypt(nonce, ciphertext).unwrap_or(Vec::new());

    String::from_utf8(plaintext).unwrap_or("".to_string())
}