const fs = require('fs');
const assert = require('assert');
const acorn = require('acorn');
const strip = require('..');
const path = require('path');

function compare(sample, options) {
	const filename = path.resolve(`test/samples/${sample}/input.js`);
	const input = fs.readFileSync(filename, 'utf-8');
	const output = strip(options).transform.call({
		parse: code =>
			acorn.parse(code, {
				sourceType: 'module',
				ecmaVersion: 9
			})
	}, input, filename);

	assert.equal(
		output ? output.code : input,
		fs.readFileSync(`test/samples/${sample}/output.js`, 'utf-8')
	);
}

describe('rollup-plugin-strip', () => {
	it('removes debugger statements', () => {
		compare('debugger');
	});

	it('does not remove debugger statements with debugger: false', () => {
		compare('debugger-false', { debugger: false });
	});

	it('removes console statements', () => {
		compare('console');
	});

	it('removes assert statements', () => {
		compare('assert');
	});

	it('leaves console statements if custom functions are provided', () => {
		compare('console-custom', { functions: ['console.log'] });
	});

	it('removes custom functions', () => {
		compare('custom', { functions: ['debug', 'custom.*'] });
	});

	it('rewrites inline call expressions (not expression statements) as void 0', () => {
		compare('inline-call-expressions');
	});

	it('rewrites inline if expessions as void 0', () => {
		compare('inline-if');
	});

	it('removes expressions in if blocks', () => {
		compare('if-block');
	});

	it('removes methods of this', () => {
		compare('this-method', { functions: ['this.*'] });
	});

	it('removes super calls', () => {
		compare('super-method', { functions: ['super.log'] });
	});

	it('replaces case body with void 0', () => {
		compare('switch-case');
	});

	it('rewrites inline while expressions as void 0', () => {
		compare('inline-while');
	});

	it('supports object destructuring assignments with default values', () => {
		compare('object-destructuring-default');
	});

	it('removes labeled blocks', () => {
		compare('label-block', { labels: ['unittest'] });
	});

});
