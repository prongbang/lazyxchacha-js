# lazyxchacha-js

Lazy XChaCha20-Poly1305 in JavaScript (WebAssembly) based on [lazyxchacha](https://crates.io/crates/lazyxchacha) and [RustCrypto: ChaCha20Poly1305](https://github.com/RustCrypto/AEADs/tree/master/chacha20poly1305).

- Key exchange: X25519
- Encryption: XChaCha20-Poly1305
- Ciphertext layout: `nonce (24 bytes) + ciphertext`

## Installation

```shell
npm install lazyxchacha
```

## Usage

### Generate a key pair

```js
const lazyxchacha = require("lazyxchacha");

const keypair = lazyxchacha.new_keypair();
console.log("pk:", keypair.pk); // hex string
console.log("sk:", keypair.sk); // hex string
```

### Key exchange (X25519)

```js
const clientKp = lazyxchacha.new_keypair();
const serverKp = lazyxchacha.new_keypair();

// Client side
const clientSharedKey = lazyxchacha.shared_key(serverKp.pk, clientKp.sk);
// Server side
const serverSharedKey = lazyxchacha.shared_key(clientKp.pk, serverKp.sk);

// clientSharedKey === serverSharedKey
```

### Encrypt / Decrypt (hex string)

```js
const sharedKey = lazyxchacha.shared_key(serverKp.pk, clientKp.sk);

const ciphertext = lazyxchacha.encrypt("Hello lazyxchacha-js", sharedKey); // hex string
const plaintext = lazyxchacha.decrypt(ciphertext, sharedKey);

console.log("ciphertext:", ciphertext);
console.log("plaintext:", plaintext);
```

### Encrypt / Decrypt (bytes)

```js
const ciphertext = lazyxchacha.encrypt_bytes("Hello lazyxchacha-js", sharedKey); // Uint8Array
const plaintext = lazyxchacha.decrypt_bytes(ciphertext, sharedKey); // string
```

### Encrypt / Decrypt (raw binary)

```js
const data = new Uint8Array([1, 2, 3, 4, 5]);

const ciphertext = lazyxchacha.encrypt_raw(data, sharedKey); // Uint8Array
const plaintext = lazyxchacha.decrypt_raw(ciphertext, sharedKey); // Uint8Array
```

### Hex helpers

```js
const hex = lazyxchacha.to_hex(new TextEncoder().encode("Hello")); // "48656c6c6f"
const bytes = lazyxchacha.from_hex(hex); // Uint8Array
```

## API

| Function | Parameters | Returns |
|---|---|---|
| `new_keypair()` | - | `KeyPair { pk, sk }` (hex strings) |
| `shared_key(pk, sk)` | hex strings | shared key as hex string |
| `encrypt(plaintext, key)` | string, hex key | hex string |
| `decrypt(ciphertext, key)` | hex string, hex key | string |
| `encrypt_bytes(plaintext, key)` | string, hex key | `Uint8Array` |
| `decrypt_bytes(ciphertext, key)` | `Uint8Array`, hex key | string |
| `encrypt_raw(plaintext, key)` | `Uint8Array`, hex key | `Uint8Array` |
| `decrypt_raw(ciphertext, key)` | `Uint8Array`, hex key | `Uint8Array` |
| `to_hex(bytes)` | `Uint8Array` | hex string |
| `from_hex(hex)` | hex string | `Uint8Array` |

Supported types across the JS/wasm boundary: https://rustwasm.github.io/docs/wasm-bindgen/reference/types.html

## Development

```shell
# Build (Node.js target)
make build

# Test in headless browsers
make test

# Publish to npm
make publish
```

## License

See [LICENSE](LICENSE).
