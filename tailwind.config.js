/** @type {import('tailwindcss').Config} */
module.exports = {
	// THIS IS THE KEY LINE
	darkMode: 'class',
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		// Ensure all your folders are listed here
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
