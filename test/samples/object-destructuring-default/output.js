export function fn({foo = void 0, bar} = {}) {
	const {baz = void 0} = bar;
}
