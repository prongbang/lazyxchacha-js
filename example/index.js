const lazyxchacha = require("lazyxchacha")

function encode(data) {
    return new TextEncoder().encode(data);
}

function decode(data) {
    return new TextDecoder().decode(data);
}

let msg = lazyxchacha.hello();

console.log("message:", msg)

let encodeMsg = lazyxchacha.to_hex(encode(msg))
console.log("encode:", encodeMsg)
let decodeMsg = decode(lazyxchacha.from_hex(encodeMsg))
console.log("decode:", decodeMsg)

const sharedKey = "edf9d004edae8335f095bb8e01975c42cf693ea60322b75cb7c6667dc836fd7e";

const ciphertext = lazyxchacha.encrypt(msg, sharedKey);
const plaintext = lazyxchacha.decrypt(ciphertext, sharedKey);
console.log("ciphertext:", ciphertext)
console.log("plaintext:", plaintext)