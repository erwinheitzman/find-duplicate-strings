import { File } from './file';
import { Store } from './store';
import { resolve } from 'path';

const dataDir = resolve(__dirname, '..', 'data');

afterEach(() => {
	Store.clear();
});

describe('File', () => {
	it('should return all string matches for a javascript file', () => {
		// arrange
		const file = new File(resolve(dataDir, 'one.js'));

		// act
		file.findAndStoreStringValues();

		// assert
		expect(Store.getAll()).toEqual([
			['foo', { count: 2, files: [resolve(dataDir, 'one.js')] }],
			['bar', { count: 1, files: [resolve(dataDir, 'one.js')] }],
		]);
	});

	it('should return all string matches for a typescript file', () => {
		// arrange
		const file = new File(resolve(dataDir, 'three.ts'));

		// act
		file.findAndStoreStringValues();

		// assert
		expect(Store.getAll()).toEqual([
			['foo', { count: 2, files: [resolve(dataDir, 'three.ts')] }],
			['bar', { count: 2, files: [resolve(dataDir, 'three.ts')] }],
			['not-unique', { count: 2, files: [resolve(dataDir, 'three.ts')] }],
		]);
	});

	it('should return all string matches for a json file', () => {
		// arrange
		const file = new File(resolve(dataDir, 'four.json'));

		// act
		file.findAndStoreStringValues();

		// assert
		expect(Store.getAll()).toEqual([
			['one', { count: 1, files: [resolve(dataDir, 'four.json')] }],
			['bar', { count: 2, files: [resolve(dataDir, 'four.json')] }],
			['two', { count: 1, files: [resolve(dataDir, 'four.json')] }],
			['foo', { count: 1, files: [resolve(dataDir, 'four.json')] }],
			['three', { count: 1, files: [resolve(dataDir, 'four.json')] }],
			['four', { count: 1, files: [resolve(dataDir, 'four.json')] }],
			['baz', { count: 1, files: [resolve(dataDir, 'four.json')] }],
			['five', { count: 1, files: [resolve(dataDir, 'four.json')] }],
			['unique', { count: 1, files: [resolve(dataDir, 'four.json')] }],
		]);
	});

	it('should return all string matches for a text file', () => {
		// arrange
		const file = new File(resolve(dataDir, 'text.txt'));

		// act
		file.findAndStoreStringValues();

		// assert
		expect(Store.getAll()).toEqual([
			['foo', { count: 2, files: [resolve(dataDir, 'text.txt')] }],
			['bar', { count: 1, files: [resolve(dataDir, 'text.txt')] }],
			['someUniqueStringValueForSure', { count: 1, files: [resolve(dataDir, 'text.txt')] }],
		]);
	});

	it('should not store empty strings', () => {
		// arrange
		const file = new File(resolve(dataDir, 'empty', 'empty-strings.js'));

		// act
		file.findAndStoreStringValues();

		// assert
		expect(Store.getAll()).toEqual([]);
	});

	it('should not store the same path path twice', () => {
		// arrange
		Store.add('foo', { count: 1, files: [resolve(dataDir, 'two.js')] });
		const file = new File(resolve(dataDir, 'one.js'));

		// act
		file.findAndStoreStringValues();

		// assert
		expect(Store.getAll()).toEqual([
			['foo', { count: 3, files: [resolve(dataDir, 'two.js'), resolve(dataDir, 'one.js')] }],
			['bar', { count: 1, files: [resolve(dataDir, 'one.js')] }],
		]);
	});
});
