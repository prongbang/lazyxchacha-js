use std::convert::TryInto;
use x25519_dalek::{StaticSecret, PublicKey};
use wasm_bindgen::prelude::*;
use crate::hex;

#[wasm_bindgen]
pub fn shared_key(pk: String, sk: String) -> String {
    let pk_vec = hex::from_hex(pk.as_str());
    let pk_bytes: [u8; 32] = pk_vec.try_into().unwrap_or([0xFF; 32]);
    let public_key = PublicKey::from(pk_bytes);

    let sk_vec = hex::from_hex(sk.as_str());
    let sk_bytes: [u8; 32] = sk_vec.try_into().unwrap_or([0xFF; 32]);
    let secret_key = StaticSecret::from(sk_bytes);

    let shared_key = secret_key.diffie_hellman(&public_key);
    let shared_key_bytes = shared_key.as_bytes();

    hex::to_hex(shared_key_bytes.to_vec())
}

#[wasm_bindgen]
pub fn new_keypair() -> Vec<String> {
    let sk = StaticSecret::random();
    let pk = PublicKey::from(&sk);
    let pk_hex = hex::to_hex(pk.as_bytes().to_vec());
    let sk_hex = hex::to_hex(sk.as_bytes().to_vec());

    let mut keypair = vec![pk_hex, sk_hex];
    keypair.swap(0, 1);

    keypair
}
