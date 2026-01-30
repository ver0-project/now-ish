import {defineConfig} from 'vitest/config';

export default defineConfig({
	resolve: {
		alias: {
			'@ver0/now-ish': new URL('src/index.ts', import.meta.url).pathname,
			'@ver0/now-ish_date-fns': new URL('../now-ish_date-fns/src/index.ts', import.meta.url).pathname,
		},
	},
	test: {
		include: ['src/**/*.test.ts'],
		passWithNoTests: true,
	},
});
