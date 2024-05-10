const lazyxchacha = require("lazyxchacha")

function encode(data) {
    return new TextEncoder().encode(data);
}

function decode(data) {
    return new TextDecoder().decode(data);
}

let msg = "Hello lazyxchacha-js";

let encodeMsg = lazyxchacha.to_hex(encode(msg))
let decodeMsg = decode(lazyxchacha.from_hex(encodeMsg))

const clientKp = lazyxchacha.new_keypair();
const serverKp = lazyxchacha.new_keypair();
const sharedKey = lazyxchacha.shared_key(serverKp.pk, clientKp.sk);

const ciphertext = lazyxchacha.encrypt(msg, sharedKey);
const plaintext = lazyxchacha.decrypt(ciphertext, sharedKey);

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