import {buildConfig} from '@ver0/eslint-config';

/** @typedef {import('eslint').Linter} Linter */

/** @type {Linter.Config[]} */
const cfg = [
	{
		ignores: ['dist', 'node_modules', '.yarn', 'coverage', 'old-src'],
	},
	...buildConfig({
		globals: 'node',
		typescript: true,
		vitest: true,
	}),
	{
		files: ['**/*.ts'],
		rules: {
			'n/no-missing-import': 'off',
		},
	},
	{
		files: ['README.md'],
		language: 'markdown/gfm',
	},
];

export default cfg;
