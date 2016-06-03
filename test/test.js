const fs = require( 'fs' );
const assert = require( 'assert' );
const undebug = require( '..' );

function compare ( sample, options ) {
	const input = fs.readFileSync( `test/samples/${sample}/input.js`, 'utf-8' );
	const output = undebug( options ).transform( input, 'input.js' );

	assert.equal( output ? output.code : input, fs.readFileSync( `test/samples/${sample}/output.js`, 'utf-8' ) );
}

describe( 'rollup-plugin-undebug', () => {
	it( 'removes debugger statements', () => {
		compare( 'debugger' );
	});

	it( 'does not remove debugger statements with debugger: false', () => {
		compare( 'debugger-false', { debugger: false });
	});

	it( 'removes console statements', () => {
		compare( 'console' );
	});

	it( 'removes assert statements', () => {
		compare( 'assert' );
	});

	it( 'leaves console statements if custom functions are provided', () => {
		compare( 'console-custom', { functions: [ 'console.log' ]});
	});

	it( 'removes custom functions', () => {
		compare( 'custom', { functions: [ 'debug', 'custom.*' ]});
	});

	it( 'rewrites inline call expressions (not expression statements) as void 0', () => {
		compare( 'inline-call-expressions' );
	});
});
