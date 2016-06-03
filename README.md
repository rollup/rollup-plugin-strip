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
  plugins: [ undebug() ]
};
```


## License

MIT
