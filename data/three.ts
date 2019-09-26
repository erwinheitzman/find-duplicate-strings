function init() {
	const foo = "foo";
	const bar = 'bar';
	const baz = `baz`;
	const unique = 'unique';

	const result = new Promise(resolve => {
		function run() {
			const foo = "foo", bar = 'bar', baz = `baz`, unique = 'unique';
			resolve({ foo, bar, baz, unique });
		}

		run();
	});

	console.log(foo, bar, baz, unique);

	return result;
}
