import { Directory } from './directory';
import { resolve } from 'path';

const dataDir = resolve(__dirname, '..', 'data');

describe('Directory', () => {
	it('should return all files matching <"js">', () => {
		// // arrange
		// const directory = new Directory('data', [''], ['js']);
		// // act
		// const result = directory.scan();
		// // assert
		// expect(result).toEqual([
		// 	resolve(dataDir, 'empty', 'empty-strings.js'),
		// 	resolve(dataDir, 'one.js'),
		// 	resolve(dataDir, 'subdir', 'one.js'),
		// 	resolve(dataDir, 'subdir', 'two.js'),
		// 	resolve(dataDir, 'two.js'),
		// ]);
	});

	// it('should return all files matching <"ts">', () => {
	// 	// arrange
	// 	const directory = new Directory('data');

	// 	// act
	// 	const result = directory.scan('', 'ts');

	// 	// assert
	// 	expect(result).toEqual([resolve(dataDir, 'subdir', 'three.ts'), resolve(dataDir, 'three.ts')]);
	// });

	// it('should return all files matching <"json">', () => {
	// 	// arrange
	// 	const directory = new Directory('data');

	// 	// act
	// 	const result = directory.scan('', 'json');

	// 	// assert
	// 	expect(result).toEqual([resolve(dataDir, 'four.json'), resolve(dataDir, 'subdir', 'four.json')]);
	// });

	// it('should return all files matching <"js" | "ts" | "json">', () => {
	// 	// arrange
	// 	const directory = new Directory('data');

	// 	// act
	// 	const result = directory.scan('', 'js;ts;json');

	// 	// assert
	// 	expect(result).toEqual([
	// 		resolve(dataDir, 'empty', 'empty-strings.js'),
	// 		resolve(dataDir, 'four.json'),
	// 		resolve(dataDir, 'one.js'),
	// 		resolve(dataDir, 'subdir', 'four.json'),
	// 		resolve(dataDir, 'subdir', 'one.js'),
	// 		resolve(dataDir, 'subdir', 'three.ts'),
	// 		resolve(dataDir, 'subdir', 'two.js'),
	// 		resolve(dataDir, 'three.ts'),
	// 		resolve(dataDir, 'two.js'),
	// 	]);
	// });

	// it('should return any files when no extensions are passed', () => {
	// 	// arrange
	// 	const directory = new Directory('data');

	// 	// act
	// 	const result = directory.scan('', '');

	// 	// assert
	// 	expect(result).toEqual([
	// 		resolve(dataDir, 'empty', 'empty-strings.js'),
	// 		resolve(dataDir, 'four.json'),
	// 		resolve(dataDir, 'one.js'),
	// 		resolve(dataDir, 'subdir', 'four.json'),
	// 		resolve(dataDir, 'subdir', 'one.js'),
	// 		resolve(dataDir, 'subdir', 'three.ts'),
	// 		resolve(dataDir, 'subdir', 'two.js'),
	// 		resolve(dataDir, 'text.txt'),
	// 		resolve(dataDir, 'three.ts'),
	// 		resolve(dataDir, 'two.js'),
	// 	]);
	// });

	// it('should exclude directories that are passed as exlusions', () => {
	// 	// arrange
	// 	const directory = new Directory('data');

	// 	// act and assert
	// 	const result = directory.scan('empty;subdir', '');

	// 	// assert
	// 	expect(result).toEqual([
	// 		resolve(dataDir, 'four.json'),
	// 		resolve(dataDir, 'one.js'),
	// 		resolve(dataDir, 'text.txt'),
	// 		resolve(dataDir, 'three.ts'),
	// 		resolve(dataDir, 'two.js'),
	// 	]);
	// });

	// it('should exclude handle extension prefixed with a dot and without', () => {
	// 	// arrange
	// 	const directory = new Directory('data');

	// 	// act and assert
	// 	const result = directory.scan('', 'js;.ts');

	// 	// assert
	// 	expect(result).toEqual([
	// 		resolve(dataDir, 'empty', 'empty-strings.js'),
	// 		resolve(dataDir, 'one.js'),
	// 		resolve(dataDir, 'subdir', 'one.js'),
	// 		resolve(dataDir, 'subdir', 'three.ts'),
	// 		resolve(dataDir, 'subdir', 'two.js'),
	// 		resolve(dataDir, 'three.ts'),
	// 		resolve(dataDir, 'two.js'),
	// 	]);
	// });

	// it('should throw an error when the directory does not exist', () => {
	// 	// arrange
	// 	const directory = new Directory('does-not-exist');

	// 	// act and assert
	// 	const result = () => directory.scan('', '');

	// 	// assert
	// 	expect(() => result()).toThrowError('Directory does not exist, please pass a valid path.');
	// });
});
