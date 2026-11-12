import javascript from '@ver0/oxlint-config/javascript.js';
import node from '@ver0/oxlint-config/node.js';
import typescript from '@ver0/oxlint-config/typescript.js';
import vitest from '@ver0/oxlint-config/vitest.js';
import {defineConfig} from 'vite-plus';

export default defineConfig({
	fmt: {
		printWidth: 120,
		useTabs: true,
		tabWidth: 2,
		semi: true,
		singleQuote: true,
		trailingComma: 'all',
		bracketSpacing: false,
	},
	lint: {
		extends: [javascript, typescript, node, vitest],
	},
	pack: {
		entry: 'src/index.ts',
		fixedExtension: false,
		dts: {generator: 'oxc'},
		publint: true,
		attw: {profile: 'esm-only'},
	},
});
