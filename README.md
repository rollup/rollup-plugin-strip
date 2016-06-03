# rollup-plugin-undebug

Remove `assert`, `console` and `debugger` statements from code.


## Installation

```bash
npm install --save-dev rollup-plugin-undebug
```


## Usage

```js
// rollup.config.js
import undebug from 'rollup-plugin-undebug';

export default {
  entry: 'src/index.js',
  dest: 'dist/my-lib.js',
  plugins: [
    undebug({
      // set this to `false` if you don't want to
      // remove debugger statements
      debugger: true,

      // defaults to `[ 'console.*', 'assert.*' ]`
      functions: [ 'console.log', 'assert.*', 'debug', 'alert' ],

      // set this to `false` if you're not using sourcemaps –
      // defaults to `true`
      sourceMap: true
    })
  ]
};
```


## License

MIT
