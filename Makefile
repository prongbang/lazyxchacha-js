create:
	cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name lazyxchacha-js

# Two builds, because one target cannot serve both runtimes:
#   web    — loads the wasm with fetch + new URL(..., import.meta.url), which
#            Vite/webpack resolve on their own. The only target that runs in a
#            browser; `nodejs` bakes in `__dirname` and `require('fs')`.
#   nodejs — CommonJS + readFileSync, for `require()` and plain node.
# An `exports` map picks per runtime, so callers just `import "lazyxchacha"`.
# wasm-pack rewrites pkg/package.json on every build, hence the merge step.
# https://github.com/rustwasm/wasm-pack/issues/837
# wasm32-unknown-unknown leaves SIMD off by default, which leaves ChaCha20 —
# a cipher designed around vector registers — running its rounds one word at a
# time. Turning it on measured +46% in Chrome for a smaller binary. The cost is
# a hard floor: a runtime without WebAssembly SIMD fails to *validate* the
# module, so it errors at import rather than running slower. That means Chrome
# 91+, Firefox 89+, Safari 16.4+ and Node 16+. To support anything older, build
# a second copy without this flag and pick with WebAssembly.validate().
export RUSTFLAGS := -C target-feature=+simd128

build:
	rm -rf pkg
	wasm-pack build --target web --release --out-dir pkg/web
	wasm-pack build --target nodejs --release --out-dir pkg/node
	node scripts/pkg-manifest.mjs
	@echo
	@$(MAKE) --no-print-directory verify

# The web bundle must not carry node built-ins, or it throws
# "__dirname is not defined" the moment a browser imports it.
verify:
	@if grep -q "__dirname\|require('fs')" pkg/web/lazyxchacha.js; then \
		echo "FAIL: pkg/web/lazyxchacha.js references node built-ins"; exit 1; \
	fi
	@if ! grep -q "__dirname" pkg/node/lazyxchacha.js; then \
		echo "FAIL: pkg/node/lazyxchacha.js is not the nodejs target"; exit 1; \
	fi
	@node --input-type=module -e "\
		import { encrypt_raw, decrypt_raw } from './pkg/node/lazyxchacha.js'; \
		const k = '3d1f8e5c0a7b46293d1f8e5c0a7b46293d1f8e5c0a7b46293d1f8e5c0a7b4629'; \
		const m = new Uint8Array([1,2,3,4,5]); \
		const out = decrypt_raw(encrypt_raw(m, k), k); \
		if (String(out) !== String(m)) { console.error('FAIL: node roundtrip'); process.exit(1); }"
	@node scripts/verify-kat.mjs
	@echo "ok: pkg/web is browser-safe, pkg/node round-trips"

replace:
	# const { TextDecoder, TextEncoder } = process.client ? globalThis : require('util');

# Test in Headless Browsers
test:
	wasm-pack test --headless --firefox

publish:
	cd pkg && npm publish
