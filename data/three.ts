function init() {
	const foo = "foo";
	const bar = 'bar';
	const baz = `baz`;
	const notUnique = 'not-unique';

	const result = new Promise(resolve => {
		function run() {
			const foo = "foo", bar = 'bar', baz = `baz`, notUnique = 'not-unique';
			resolve({ foo, bar, baz, notUnique });
		}

		run();
	});

	console.log(foo, bar, baz, notUnique);

	return result;
}
