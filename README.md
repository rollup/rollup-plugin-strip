# rollup-plugin-strip

Remove `debugger` statements and functions like `assert` and `console` from your code.


## Installation

```bash
npm install --save-dev rollup-plugin-strip
```


## Usage

```js
// rollup.config.js
import strip from 'rollup-plugin-strip';

export default {
  entry: 'src/index.js',
  dest: 'dist/my-lib.js',
  plugins: [
    strip({
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
