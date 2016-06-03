import { extname } from 'path';
import acorn from 'acorn';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { createFilter } from 'rollup-pluginutils';

const firstpass = /\b(?:console|assert|debugger)\b/;
const whitespace = /\s/;

export default function commonjs ( options = {} ) {
	const filter = createFilter( options.include, options.exclude );

	return {
		transform ( code, id ) {
			if ( !filter( id ) ) return null;
			if ( extname( id ) !== '.js' ) return null;
			if ( !firstpass.test( code ) ) return null;

			let ast;

			try {
				ast = acorn.parse( code, {
					ecmaVersion: 6,
					sourceType: 'module'
				});
			} catch ( err ) {
				err.message += ` in ${id}`;
				throw err;
			}

			const magicString = new MagicString( code );

			function remove ( start, end ) {
				while ( whitespace.test( code[ start - 1 ] ) ) start -= 1;
				magicString.remove( start, end );
			}

			walk( ast, {
				enter ( node ) {
					if ( options.sourceMap ) {
						magicString.addSourcemapLocation( node.start );
						magicString.addSourcemapLocation( node.end );
					}

					if ( node.type === 'DebuggerStatement' ) {
						remove( node.start, node.end );
					}

					else if ( node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' ) {
						const callee = node.expression.callee;
						if ( callee.type !== 'MemberExpression' ) return;
						if ( callee.object.type !== 'Identifier' ) return;

						const name = callee.object.name;
						if ( name === 'console' || name === 'assert' ) {
							remove( node.start, node.end );
						}
					}
				}
			});

			code = magicString.toString();
			const map = options.sourceMap ? magicString.generateMap() : null;

			return { code, map };
		}
	};
}
