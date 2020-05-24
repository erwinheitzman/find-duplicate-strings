import { Scanner } from './scan';

const scanner = new Scanner();

describe('scanDir', () => {
	it('should retrieve all duplicates from ["js"] files', () => {
		expect(scanner.scanDir('data', ['js'])).toEqual(getJsOutput());
	});

	it('should retrieve all duplicates from all ["ts"] files', () => {
		expect(scanner.scanDir('data', ['ts'])).toEqual(getTsOuput());
	});

	it('should retrieve all duplicates from all ["json"] files', () => {
		expect(scanner.scanDir('data', ['json'])).toEqual(getJsonOutput());
	});

	it('should retrieve all duplicates from all ["js", "ts", "json"] files', () => {
		expect(scanner.scanDir('data', ['js', 'ts', 'json'])).toEqual(getAllOutput());
	});

	it('should not return any matches for empty strings', () => {
		expect(scanner.scanDir('data/empty', ['js'])).toEqual({});
	});

	it('should not return any matches when no valid formats are passed', () => {
		expect(scanner.scanDir('data', [])).toEqual({});
	});

	it('should throw an error when the directory does not exist', () => {
		expect(() => scanner.scanDir('does-not-exist', [])).toThrowError(
			"no such file or directory, scandir 'does-not-exist'",
		);
	});
});

const getJsOutput = () => ({
	foo: {
		count: 6,
		files: [
			'C:\\dev\\squasher\\data\\one.js',
			'C:\\dev\\squasher\\data\\subdir\\one.js',
			'C:\\dev\\squasher\\data\\subdir\\two.js',
			'C:\\dev\\squasher\\data\\two.js',
		],
	},
	bar: {
		count: 6,
		files: [
			'C:\\dev\\squasher\\data\\one.js',
			'C:\\dev\\squasher\\data\\subdir\\one.js',
			'C:\\dev\\squasher\\data\\subdir\\two.js',
			'C:\\dev\\squasher\\data\\two.js',
		],
	},
	"'foo' \\'bar\\' baz": {
		count: 1,
		files: ['C:\\dev\\squasher\\data\\subdir\\one.js'],
	},
	"'foo'' \\\\ \\\"bar\\\" baz": {
		count: 1,
		files: ['C:\\dev\\squasher\\data\\subdir\\one.js'],
	},
	unique: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\subdir\\two.js', 'C:\\dev\\squasher\\data\\two.js'],
	},
});

const getTsOuput = () => ({
	foo: {
		count: 4,
		files: ['C:\\dev\\squasher\\data\\subdir\\three.ts', 'C:\\dev\\squasher\\data\\three.ts'],
	},
	bar: {
		count: 4,
		files: ['C:\\dev\\squasher\\data\\subdir\\three.ts', 'C:\\dev\\squasher\\data\\three.ts'],
	},
	unique: {
		count: 4,
		files: ['C:\\dev\\squasher\\data\\subdir\\three.ts', 'C:\\dev\\squasher\\data\\three.ts'],
	},
});

const getJsonOutput = () => ({
	one: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	bar: {
		count: 4,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	two: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	foo: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	three: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	four: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	baz: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	five: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	unique: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
});

const getAllOutput = () => ({
	one: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	bar: {
		count: 14,
		files: [
			'C:\\dev\\squasher\\data\\four.json',
			'C:\\dev\\squasher\\data\\one.js',
			'C:\\dev\\squasher\\data\\subdir\\four.json',
			'C:\\dev\\squasher\\data\\subdir\\one.js',
			'C:\\dev\\squasher\\data\\subdir\\three.ts',
			'C:\\dev\\squasher\\data\\subdir\\two.js',
			'C:\\dev\\squasher\\data\\three.ts',
			'C:\\dev\\squasher\\data\\two.js',
		],
	},
	two: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	foo: {
		count: 12,
		files: [
			'C:\\dev\\squasher\\data\\four.json',
			'C:\\dev\\squasher\\data\\one.js',
			'C:\\dev\\squasher\\data\\subdir\\four.json',
			'C:\\dev\\squasher\\data\\subdir\\one.js',
			'C:\\dev\\squasher\\data\\subdir\\three.ts',
			'C:\\dev\\squasher\\data\\subdir\\two.js',
			'C:\\dev\\squasher\\data\\three.ts',
			'C:\\dev\\squasher\\data\\two.js',
		],
	},
	three: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	four: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	baz: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	five: {
		count: 2,
		files: ['C:\\dev\\squasher\\data\\four.json', 'C:\\dev\\squasher\\data\\subdir\\four.json'],
	},
	unique: {
		count: 8,
		files: [
			'C:\\dev\\squasher\\data\\four.json',
			'C:\\dev\\squasher\\data\\subdir\\four.json',
			'C:\\dev\\squasher\\data\\subdir\\three.ts',
			'C:\\dev\\squasher\\data\\subdir\\two.js',
			'C:\\dev\\squasher\\data\\three.ts',
			'C:\\dev\\squasher\\data\\two.js',
		],
	},
	"'foo' \\'bar\\' baz": {
		count: 1,
		files: ['C:\\dev\\squasher\\data\\subdir\\one.js'],
	},
	"'foo'' \\\\ \\\"bar\\\" baz": {
		count: 1,
		files: ['C:\\dev\\squasher\\data\\subdir\\one.js'],
	},
});
