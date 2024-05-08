mod utils;
mod keypair;
mod hex;
mod lazyxchacha;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn hello() -> String {
    return "Hello, lazyxchacha-js!".to_string();
}
