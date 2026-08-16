const lazyxchacha = require("lazyxchacha")

function encode(data) {
    return new TextEncoder().encode(data);
}

function decode(data) {
    return new TextDecoder().decode(data);
}

let msg = "Hello lazyxchacha-js";

// Hex helpers
let encodeMsg = lazyxchacha.to_hex(encode(msg))
let decodeMsg = decode(lazyxchacha.from_hex(encodeMsg))

// Key exchange (X25519)
const clientKp = lazyxchacha.new_keypair();
const serverKp = lazyxchacha.new_keypair();
const sharedKey = lazyxchacha.shared_key(serverKp.pk, clientKp.sk);

// Encrypt / Decrypt (hex string)
const ciphertext = lazyxchacha.encrypt(msg, sharedKey);
const plaintext = lazyxchacha.decrypt(ciphertext, sharedKey);

// Encrypt / Decrypt (bytes)
const ciphertextBytes = lazyxchacha.encrypt_bytes(msg, sharedKey);
const plaintextBytes = lazyxchacha.decrypt_bytes(ciphertextBytes, sharedKey);

// Encrypt / Decrypt (raw binary)
const data = new Uint8Array([1, 2, 3, 4, 5]);
const ciphertextRaw = lazyxchacha.encrypt_raw(data, sharedKey);
const plaintextRaw = lazyxchacha.decrypt_raw(ciphertextRaw, sharedKey);

console.log("message:", msg)
console.log("encode:", encodeMsg)
console.log("decode:", decodeMsg)
console.log("client-pk:", clientKp.pk)
console.log("client-sk:", clientKp.sk)
console.log("server-pk:", serverKp.pk)
console.log("server-sk:", serverKp.sk)
console.log("sharedKey:", sharedKey)
console.log("ciphertext:", ciphertext)
console.log("plaintext:", plaintext)
console.log("ciphertext-bytes:", ciphertextBytes)
console.log("plaintext-bytes:", plaintextBytes)
console.log("ciphertext-raw:", ciphertextRaw)
console.log("plaintext-raw:", plaintextRaw)
