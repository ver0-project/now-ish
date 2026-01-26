import baseConfig from '@react-hookz/eslint-config/base.js';
import mdConfig from '@react-hookz/eslint-config/md.js';
import typescript from '@react-hookz/eslint-config/typescript.js';
import vitestConfig from '@react-hookz/eslint-config/vitest.js';

/** @typedef {import('eslint').Linter} Linter */
/** @type {Linter.Config[]} */
const config = [
	{
		ignores: ['.idea', 'coverage', 'dist', 'node_modules'],
	},
	...baseConfig,
	...mdConfig,
	...typescript,
	...vitestConfig,
];

export default config;
