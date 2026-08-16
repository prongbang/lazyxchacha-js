use lazyxchacha::keypair::{StaticKeyPair, StaticSharedKey};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn shared_key(pk: String, sk: String) -> String {
    StaticSharedKey::new(pk, sk)
}

#[wasm_bindgen(getter_with_clone)]
pub struct KeyPair {
    pub pk: String,
    pub sk: String,
}

#[wasm_bindgen]
pub fn new_keypair() -> KeyPair {
    let keypair = StaticKeyPair::new();

    KeyPair {
        pk: keypair.pk_string(),
        sk: keypair.sk_string(),
    }
}
