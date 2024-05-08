mod utils;

use wasm_bindgen::prelude::*;
use crate::utils::set_panic_hook;

#[wasm_bindgen]
pub struct LazyXChaCha {}

#[wasm_bindgen]
pub fn encrypt(plaintext: &str, key: &str) -> String {
    return plaintext.to_string();
}

#[wasm_bindgen]
pub fn decrypt(ciphertext: &str, key: &str) -> String {
    return ciphertext.to_string();
}

#[wasm_bindgen]
pub fn hello() -> String {
    return "Hello, lazyxchacha-js!".to_string();
}
