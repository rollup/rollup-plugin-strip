const fs = require( 'fs' );
const assert = require( 'assert' );
const undebug = require( '..' );

describe( 'rollup-plugin-undebug', () => {
	it( 'removes debugger statements', () => {
		const input = fs.readFileSync( 'test/samples/debugger/input.js', 'utf-8' );
		const output = undebug().transform( input, 'input.js' ).code;

		assert.equal( output, fs.readFileSync( 'test/samples/debugger/output.js', 'utf-8' ) );
	});

	it( 'removes console statements', () => {
		const input = fs.readFileSync( 'test/samples/console/input.js', 'utf-8' );
		const output = undebug().transform( input, 'input.js' ).code;

		assert.equal( output, fs.readFileSync( 'test/samples/console/output.js', 'utf-8' ) );
	});

	it( 'removes assert statements', () => {
		const input = fs.readFileSync( 'test/samples/assert/input.js', 'utf-8' );
		const output = undebug().transform( input, 'input.js' ).code;

		assert.equal( output, fs.readFileSync( 'test/samples/assert/output.js', 'utf-8' ) );
	});
});
