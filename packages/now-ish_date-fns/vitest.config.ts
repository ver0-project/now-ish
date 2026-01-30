import {defineConfig} from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'@ver0/now-ish': new URL('../now-ish/src/index.ts', import.meta.url).pathname,
		},
	},
	test: {
		include: ['src/**/*.test.ts'],
		passWithNoTests: true,
		coverage: {
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.test.ts', '**/now-ish/**', '**/now-ish_temporal/**'],
		},
	},
});
