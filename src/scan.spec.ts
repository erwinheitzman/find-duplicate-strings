import { Scanner } from './scan';
import { resolve } from 'path';

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

const dataOneJs = resolve(__dirname, '..', 'data', 'one.js');
const dataTwoJs = resolve(__dirname, '..', 'data', 'two.js');
const dataThreeTs = resolve(__dirname, '..', 'data', 'three.ts');
const dataFourJson = resolve(__dirname, '..', 'data', 'four.json');
const dataSubdirOneJs = resolve(__dirname, '..', 'data', 'subdir', 'one.js');
const dataSubdirTwoJs = resolve(__dirname, '..', 'data', 'subdir', 'two.js');
const dataSubdirThreeTs = resolve(__dirname, '..', 'data', 'subdir', 'three.ts');
const dataSubdirFourJson = resolve(__dirname, '..', 'data', 'subdir', 'four.json');

const getJsOutput = () => ({
	foo: {
		count: 6,
		files: [dataOneJs, dataSubdirOneJs, dataSubdirTwoJs, dataTwoJs],
	},
	bar: {
		count: 6,
		files: [dataOneJs, dataSubdirOneJs, dataSubdirTwoJs, dataTwoJs],
	},
	"'foo' \\'bar\\' baz": {
		count: 1,
		files: [dataSubdirOneJs],
	},
	"'foo'' \\\\ \\\"bar\\\" baz": {
		count: 1,
		files: [dataSubdirOneJs],
	},
	unique: {
		count: 2,
		files: [dataSubdirTwoJs, dataTwoJs],
	},
});

const getTsOuput = () => ({
	foo: {
		count: 4,
		files: [dataSubdirThreeTs, dataThreeTs],
	},
	bar: {
		count: 4,
		files: [dataSubdirThreeTs, dataThreeTs],
	},
	unique: {
		count: 4,
		files: [dataSubdirThreeTs, dataThreeTs],
	},
});

const getJsonOutput = () => ({
	one: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	bar: {
		count: 4,
		files: [dataFourJson, dataSubdirFourJson],
	},
	two: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	foo: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	three: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	four: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	baz: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	five: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	unique: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
});

const getAllOutput = () => ({
	one: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	bar: {
		count: 14,
		files: [
			dataFourJson,
			dataOneJs,
			dataSubdirFourJson,
			dataSubdirOneJs,
			dataSubdirThreeTs,
			dataSubdirTwoJs,
			dataThreeTs,
			dataTwoJs,
		],
	},
	two: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	foo: {
		count: 12,
		files: [
			dataFourJson,
			dataOneJs,
			dataSubdirFourJson,
			dataSubdirOneJs,
			dataSubdirThreeTs,
			dataSubdirTwoJs,
			dataThreeTs,
			dataTwoJs,
		],
	},
	three: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	four: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	baz: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	five: {
		count: 2,
		files: [dataFourJson, dataSubdirFourJson],
	},
	unique: {
		count: 8,
		files: [dataFourJson, dataSubdirFourJson, dataSubdirThreeTs, dataSubdirTwoJs, dataThreeTs, dataTwoJs],
	},
	"'foo' \\'bar\\' baz": {
		count: 1,
		files: [dataSubdirOneJs],
	},
	"'foo'' \\\\ \\\"bar\\\" baz": {
		count: 1,
		files: [dataSubdirOneJs],
	},
});
