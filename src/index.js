import acorn from 'acorn';
import { strictEqual } from 'assert';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { createFilter } from 'rollup-pluginutils';

const whitespace = /\s/;

function getName ( node ) {
	if ( node.type === 'Identifier' ) return node.name;
	if ( node.type === 'ThisExpression' ) return 'this';
	if ( node.type === 'Super' ) return 'super';

	return null;
}

function flatten ( node ) {
	let name;
	let parts = [];

	while ( node.type === 'MemberExpression' ) {
		if ( node.computed ) return null;

		parts.unshift( node.property.name );
		node = node.object;
	}

	name = getName( node );

	if ( !name ) return null;

	parts.unshift( name );
	return parts.join( '.' );
}

export default function strip ( options = {} ) {
	const include = options.include || '**/*.js';
	const exclude = options.exclude;
	const filter = createFilter( include, exclude );
	const sourceMap = options.sourceMap !== false;

	const removeDebuggerStatements = options.debugger !== false;
	const functions = ( options.functions || [ 'console.*', 'assert.*' ] )
		.map( keypath => keypath.replace( /\./g, '\\.' ).replace( /\*/g, '\\w+' ) );

	const firstpass = new RegExp( `\\b(?:${functions.join( '|' )}|debugger)\\b` );
	const pattern = new RegExp( `^(?:${functions.join( '|' )})$` );

	return {
		name: 'strip',

		transform ( code, id ) {
			if ( !filter( id ) ) return null;
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
			let edited = false;

			function remove ( start, end ) {
				while ( whitespace.test( code[ start - 1 ] ) ) start -= 1;
				magicString.remove( start, end );
			}

			const ancestors = [];

			walk( ast, {
				enter ( node, parent ) {
					if ( sourceMap ) {
						magicString.addSourcemapLocation( node.start );
						magicString.addSourcemapLocation( node.end );
					}

					if ( removeDebuggerStatements && node.type === 'DebuggerStatement' ) {
						remove( node.start, node.end );
						edited = true;
					}

					else if ( node.type === 'CallExpression' ) {
						const keypath = flatten( node.callee );
						if ( keypath && pattern.test( keypath ) ) {
							const grandparent = ancestors[ ancestors.length - 2 ];
							console.log( "grandparent", grandparent.type );

							if ( parent.type === 'ExpressionStatement' && ( grandparent.type === 'BlockStatement' || grandparent.type === 'Program' ) ) {
								remove( parent.start, parent.end );
							} else {
								magicString.overwrite( node.start, node.end, 'void 0' );
							}
							edited = true;

							this.skip();
						}
					}
					
					ancestors.push( node );
				},
				
				exit ( node ) {
					const popped = ancestors.pop();

					strictEqual(
						popped,
						node,
						'expected ' + node.type + ' but got ' + ( popped && popped.type )
					);
				}
			});

			if ( !edited ) return null;

			code = magicString.toString();
			const map = sourceMap ? magicString.generateMap() : null;

			return { code, map };
		}
	};
}
