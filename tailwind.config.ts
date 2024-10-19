import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('@tailwindcss/forms')],
};
export default config;
