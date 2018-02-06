import buble from 'rollup-plugin-buble';

export default {
	input: 'src/index.js',
	plugins: [ buble() ],
	output: [
		{
			format: 'cjs',
			file: 'dist/rollup-plugin-strip.cjs.js'
		},
		{
			format: 'es',
			file: 'dist/rollup-plugin-strip.es.js'
		}
	]
};
