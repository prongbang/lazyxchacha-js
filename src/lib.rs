mod utils;
mod keypair;
mod hex;

use wasm_bindgen::prelude::*;

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
