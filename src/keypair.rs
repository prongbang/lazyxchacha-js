use std::convert::TryInto;
use x25519_dalek::{EphemeralSecret, PublicKey};
use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// pub struct SharedKey {}
//
// #[wasm_bindgen]
// impl SharedKey {
//     pub fn new(pk: String, sk: EphemeralSecret) -> String {
//         let pk_vec = hex::decode(pk.as_str());
//         let pk_bytes: [u8; 32] = pk_vec.try_into().unwrap_or([0xFF; 32]);
//         let public_key = PublicKey::from(pk_bytes);
//
//         let shared_key = sk.diffie_hellman(&public_key);
//         let shared_key_bytes = shared_key.as_bytes();
//
//         hex::encode(shared_key_bytes.to_vec())
//     }
// }
//
// #[wasm_bindgen]
// pub struct KeyPair {
//     pub pk: PublicKey,
//     pub sk: EphemeralSecret,
// }
//
// #[wasm_bindgen]
// impl KeyPair {
//     pub fn new() -> KeyPair {
//         let sk = EphemeralSecret::random();
//         let pk = PublicKey::from(&sk);
//
//         Self { pk, sk }
//     }
//
//     pub fn pk_string(&self) -> String {
//         hex::encode(self.pk.as_bytes().to_vec())
//     }
// }
