use lazyxchacha::lazyxchacha::LazyXChaCha;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn encrypt(plaintext: &str, key: &str) -> String {
    LazyXChaCha::new().encrypt(plaintext, key)
}

#[wasm_bindgen]
pub fn decrypt(ciphertext: &str, key: &str) -> String {
    LazyXChaCha::new().decrypt(ciphertext, key)
}

#[wasm_bindgen]
pub fn encrypt_bytes(plaintext: &str, key: &str) -> Vec<u8> {
    LazyXChaCha::new().encrypt_bytes(plaintext, key)
}

#[wasm_bindgen]
pub fn decrypt_bytes(ciphertext: Vec<u8>, key: &str) -> String {
    LazyXChaCha::new().decrypt_bytes(ciphertext, key)
}

#[wasm_bindgen]
pub fn encrypt_raw(plaintext: &[u8], key: &str) -> Vec<u8> {
    LazyXChaCha::new().encrypt_raw(plaintext, key)
}

#[wasm_bindgen]
pub fn decrypt_raw(ciphertext: &[u8], key: &str) -> Vec<u8> {
    LazyXChaCha::new().decrypt_raw(ciphertext, key)
}
