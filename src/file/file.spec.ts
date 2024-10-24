import { resolve } from 'node:path';
import { File } from './file';
import { Store } from '../store/store';

beforeEach(() => {
	Store.clear();
});

describe('File', () => {
	it('should add and update matches to store', async () => {
		const path1 = resolve(__dirname, './mocks/file1.js');
		const path2 = resolve(__dirname, './mocks/file2.js');

		await new File(path1).processContent();

		expect(Store.getAll()).toEqual([
			{
				count: 1,
				files: [path1],
				key: 'foo',
			},
			{
				count: 1,
				files: [path1],
				key: 'bar',
			},
		]);

		await new File(path2).processContent();

		expect(Store.getAll()).toEqual([
			{
				count: 4,
				files: [path1, path2],
				key: 'foo',
			},
			{
				count: 1,
				files: [path1],
				key: 'bar',
			},
		]);
	});

	it('should not store empty string values', async () => {
		const path = resolve(__dirname, './mocks/empty-strings-file.js');

		await new File(path).processContent();

		expect(Store.getAll()).toEqual([]);
	});

	it('should not store the same path path twice', async () => {
		const path = resolve(__dirname, './mocks/file2.js');

		await new File(path).processContent();

		expect(Store.getAll()).toEqual([
			{
				count: 3,
				files: [path],
				key: 'foo',
			},
		]);
	});

	it('should store all matches', async () => {
		const path = resolve(__dirname, './mocks/file3.js');

		await new File(path).processContent();

		expect(Store.getAll()).toEqual([
			{
				count: 2,
				files: [path],
				key: 'foo',
			},
			{
				count: 1,
				files: [path],
				key: "f\\'o\\'\\'o\\'bar",
			},
			{
				count: 1,
				files: [path],
				key: 'bar',
			},
		]);
	});

	it('should not call the store when there are no strings/matches', async () => {
		const path = resolve(__dirname, './mocks/no-strings-file');

		await new File(path).processContent();

		expect(Store.getAll()).toEqual([]);
	});

	it('should not call the store when the file is empty', async () => {
		const path = resolve(__dirname, './mocks/empty-file');

		await new File(path).processContent();

		expect(Store.getAll()).toEqual([]);
	});
});
