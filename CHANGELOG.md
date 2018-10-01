# rollup-plugin-strip changelog

## 1.2.0

* Use `this.parse` instead of `acorn.parse`
* Make code removal more conservative ([#9](https://github.com/rollup/rollup-plugin-strip/pull/9))

## 1.1.1

* Return a `name`

## 1.1.0

* Remove methods of `this` and `super` ([#3](https://github.com/rollup/rollup-plugin-strip/issues/3))

## 1.0.3

* Fix build

## 1.0.2

* Default to adding sourcemap locations

## 1.0.1

* Skip removed call expressions from further AST traversal

## 1.0.0

* Initial release
