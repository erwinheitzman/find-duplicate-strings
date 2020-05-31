import { Directory } from './directory';
import { resolve } from 'path';

const directory = new Directory();
const dataDir = resolve(__dirname, '..', 'data');

describe('Directory', () => {
	it('should return all files matching <"js">', () => {
		expect(directory.scan('data', '', ['js'])).toEqual([
			resolve(dataDir, 'empty', 'empty-strings.js'),
			resolve(dataDir, 'one.js'),
			resolve(dataDir, 'subdir', 'one.js'),
			resolve(dataDir, 'subdir', 'two.js'),
			resolve(dataDir, 'two.js'),
		]);
	});

	it('should return all files matching <"ts">', () => {
		expect(directory.scan('data', '', ['ts'])).toEqual([
			resolve(dataDir, 'subdir', 'three.ts'),
			resolve(dataDir, 'three.ts'),
		]);
	});

	it('should return all files matching <"json">', () => {
		expect(directory.scan('data', '', ['json'])).toEqual([
			resolve(dataDir, 'four.json'),
			resolve(dataDir, 'subdir', 'four.json'),
		]);
	});

	it('should return all files matching <"js" | "ts" | "json">', () => {
		expect(directory.scan('data', '', ['js', 'ts', 'json'])).toEqual([
			resolve(dataDir, 'empty', 'empty-strings.js'),
			resolve(dataDir, 'four.json'),
			resolve(dataDir, 'one.js'),
			resolve(dataDir, 'subdir', 'four.json'),
			resolve(dataDir, 'subdir', 'one.js'),
			resolve(dataDir, 'subdir', 'three.ts'),
			resolve(dataDir, 'subdir', 'two.js'),
			resolve(dataDir, 'three.ts'),
			resolve(dataDir, 'two.js'),
		]);
	});

	it('should return any files when no extensions are passed', () => {
		expect(directory.scan('data', '', [])).toEqual([
			resolve(dataDir, 'empty', 'empty-strings.js'),
			resolve(dataDir, 'four.json'),
			resolve(dataDir, 'one.js'),
			resolve(dataDir, 'subdir', 'four.json'),
			resolve(dataDir, 'subdir', 'one.js'),
			resolve(dataDir, 'subdir', 'three.ts'),
			resolve(dataDir, 'subdir', 'two.js'),
			resolve(dataDir, 'text.txt'),
			resolve(dataDir, 'three.ts'),
			resolve(dataDir, 'two.js'),
		]);
	});

	it('should throw an error when the directory does not exist', () => {
		expect(() => directory.scan('does-not-exist', '', [])).toThrowError(
			'Directory does not exist, please pass a valid path.',
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
