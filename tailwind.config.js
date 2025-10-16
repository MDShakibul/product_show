/**** JavaScript config ****/
/**** Adjust content globs as needed. ****/


/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
'./app/**/*.{js,jsx}',
'./components/**/*.{js,jsx}',
'./lib/**/*.{js,jsx}',
],
theme: {
extend: {
colors: {
background: 'var(--bg)',
foreground: 'var(--fg)',
primary: 'var(--primary)',
accent: 'var(--accent)',
muted: 'var(--muted)',
card: 'var(--card)',
ring: 'var(--ring)'
},
borderRadius: {
xl: '1rem',
'2xl': '1.25rem'
},
boxShadow: {
soft: '0 6px 24px -4px rgba(0,0,0,0.15)'
}
}
},
plugins: []
}