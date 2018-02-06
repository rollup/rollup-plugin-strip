import buble from 'rollup-plugin-buble';

export default {
	input: 'src/index.js',
	plugins: [ buble() ],
	targets: [
		{
			format: 'cjs',
			dest: 'dist/rollup-plugin-strip.cjs.js'
		},
		{
			format: 'es',
			dest: 'dist/rollup-plugin-strip.es.js'
		}
	]
};
