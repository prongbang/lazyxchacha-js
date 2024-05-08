use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn from_hex(text: &str) -> Vec<u8> {
    let mut dst = vec![0; text.len() / 2];
    faster_hex::hex_decode(text.as_bytes(), &mut dst).unwrap_or(());
    dst
}

#[wasm_bindgen]
pub fn to_hex(byte: Vec<u8>) -> String {
    faster_hex::hex_string(byte.as_slice())
}