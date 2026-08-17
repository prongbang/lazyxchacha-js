// wasm-pack writes one package.json per --out-dir and knows nothing about the
// sibling build, so it cannot express "browser gets web/, node gets node/".
// This stitches the two into a single publishable package at pkg/.
import { readFileSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';


const web = JSON.parse(readFileSync('pkg/web/package.json', 'utf8'));

const manifest = {
	name: web.name,
	version: web.version,
	description: web.description,
	license: web.license,
	repository: web.repository,
	keywords: web.keywords,
	type: 'module',
	// "browser" must come before "node"/"default": bundlers pick the first key
	// they recognise, and a browser build that resolves to node/ is exactly the
	// __dirname crash this layout exists to prevent.
	exports: {
		'.': {
			types: './web/lazyxchacha.d.ts',
			browser: './web/lazyxchacha.js',
			node: {
				require: './node/lazyxchacha.js',
				default: './node/lazyxchacha.js'
			},
			default: './web/lazyxchacha.js'
		}
	},
	// For tools that still read the legacy fields rather than "exports".
	main: './node/lazyxchacha.js',
	browser: './web/lazyxchacha.js',
	types: './web/lazyxchacha.d.ts',
	files: ['web', 'node', 'LICENSE', 'README.md'],
	sideEffects: false
};

writeFileSync('pkg/package.json', JSON.stringify(manifest, null, 2) + '\n');

for (const dir of ['web', 'node']) {
	rmSync(`pkg/${dir}/package.json`, { force: true });
	rmSync(`pkg/${dir}/.gitignore`, { force: true });
	rmSync(`pkg/${dir}/README.md`, { force: true });
	rmSync(`pkg/${dir}/LICENSE`, { force: true });
}

// The root is "type": "module" for the web build, so the nodejs target — which
// is CommonJS — needs its own scope or node reads its `require()` calls as ESM.
writeFileSync('pkg/node/package.json', JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');

// Both were deleted with the per-build manifests above; npm wants them at the
// package root, not inside web/ and node/.
copyFileSync('LICENSE', 'pkg/LICENSE');
copyFileSync('README.md', 'pkg/README.md');

console.log(`pkg/package.json written for ${manifest.name}@${manifest.version}`);
