create:
	cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name lazyxchacha-js

# https://github.com/rustwasm/wasm-pack/issues/837
build:
	wasm-pack build --target nodejs --release
	#wasm-pack build --target web --scope lazyxchacha
	#wasm-pack build --target web
	#wasm-pack build --target no-modules
	#wasm-pack build --target bundler
	#wasm-pack build --target nodejs --no-typescript

replace:
	# const { TextDecoder, TextEncoder } = process.client ? globalThis : require('util');

# Test in Headless Browsers
test:
	wasm-pack test --headless --firefox

publish:
	wasm-pack publish