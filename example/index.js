const lazyxchacha = require("lazyxchacha")

function encode(data) {
    return new TextEncoder().encode(data);
}

function decode(data) {
    return new TextDecoder().decode(data);
}

let msg = lazyxchacha.hello();

console.log("message:", msg)

let encodeMsg = lazyxchacha.encode(encode(msg))
console.log("encode:", encodeMsg)
let decodeMsg = decode(lazyxchacha.decode(encodeMsg))
console.log("decode:", decodeMsg)
