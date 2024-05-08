const lazyxchacha = require("lazyxchacha")

function encode(data) {
    return new TextEncoder().encode(data);
}

function decode(data) {
    return new TextDecoder().decode(data);
}

let msg = lazyxchacha.hello();

let encodeMsg = lazyxchacha.to_hex(encode(msg))
let decodeMsg = decode(lazyxchacha.from_hex(encodeMsg))

const clientKp = lazyxchacha.new_keypair();
const clientPk = clientKp[0];
const clientSk = clientKp[1];

const serverKp = lazyxchacha.new_keypair();
const serverPk = serverKp[0];
const serverSk = serverKp[1];

const sharedKey = lazyxchacha.shared_key(serverPk, clientSk);
const ciphertext = lazyxchacha.encrypt(msg, sharedKey);
const plaintext = lazyxchacha.decrypt(ciphertext, sharedKey);

console.log("message:", msg)
console.log("encode:", encodeMsg)
console.log("decode:", decodeMsg)
console.log("client-pk:", clientPk)
console.log("client-sk:", clientSk)
console.log("server-pk:", serverPk)
console.log("server-sk:", serverSk)
console.log("sharedKey:", sharedKey)
console.log("ciphertext:", ciphertext)
console.log("plaintext:", plaintext)