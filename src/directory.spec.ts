import { Directory } from './directory';
import { promises, existsSync, statSync } from 'fs';
import { resolve, extname } from 'path';

const promisesMock = ((promises as unknown) = { readdir: jest.fn() });
const existsSyncMock = existsSync as jest.Mock<any, any>;
const isDirectoryMock = statSync as jest.Mock<any, any>;
const resolveMock = resolve as jest.Mock<any, any>;
const extnameMock = extname as jest.Mock<any, any>;

jest.mock('./store');
jest.mock('fs');
jest.mock('path');

describe('Directory', () => {
	beforeEach(() => {
		existsSyncMock.mockReturnValue(true);
		isDirectoryMock.mockReturnValue({ isDirectory: () => true });
		extnameMock.mockReturnValue('.txt');
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should throw when the directory does not exist', () => {
		existsSyncMock.mockReturnValue(false);

		expect(() => new Directory('dummy-directory', [], [])).toThrowError(
			'Directory does not exist, please pass a valid path.',
		);
	});

	it('should throw when the path does not point to a directory', () => {
		isDirectoryMock.mockReturnValue({ isDirectory: () => false });

		expect(() => new Directory('dummy-directory', [], [])).toThrowError('Path does not point to a directory.');
	});

	it('should return files', async () => {
		promisesMock.readdir.mockResolvedValue([
			{ name: 'file1', isDirectory: () => false },
			{ name: 'file2', isDirectory: () => false },
		]);
		resolveMock.mockReturnValueOnce('dir').mockReturnValueOnce('dir/file1').mockReturnValueOnce('dir/file2');
		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should recursively go trough directories', async () => {
		promisesMock.readdir.mockReturnValueOnce([{ name: 'sub-dir', isDirectory: () => true }]).mockReturnValueOnce([
			{ name: 'sub-dir-file1', isDirectory: () => false },
			{ name: 'sub-dir-file2', isDirectory: () => false },
			{ name: 'file2', isDirectory: () => false },
		]);
		resolveMock
			.mockReturnValueOnce('dir')
			.mockReturnValueOnce('dir/sub-dir')
			.mockReturnValueOnce('dir/sub-dir-file1')
			.mockReturnValueOnce('dir/sub-dir-file2')
			.mockReturnValueOnce('dir/file2');
		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/sub-dir-file1');
		expect((await files.next()).value).toEqual('dir/sub-dir-file2');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should exlude files/directories matching "file1"', async () => {
		promisesMock.readdir.mockReturnValueOnce([
			{ name: 'file1', isDirectory: () => false },
			{ name: 'file2', isDirectory: () => false },
		]);
		resolveMock.mockReturnValueOnce('dir').mockReturnValueOnce('dir/file2');

		const directory = new Directory('dummy-directory', ['file1'], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should return files matching file extension "ts"', async () => {
		promisesMock.readdir.mockReturnValueOnce([
			{ name: 'file1', isDirectory: () => false },
			{ name: 'file2', isDirectory: () => false },
			{ name: 'file3', isDirectory: () => false },
		]);
		extnameMock.mockReturnValueOnce('.ts').mockReturnValueOnce('.txt').mockReturnValueOnce('.ts');
		resolveMock
			.mockReturnValueOnce('dir')
			.mockReturnValueOnce('dir/file1')
			.mockReturnValueOnce('dir/file2')
			.mockReturnValueOnce('dir/file3');
		const directory = new Directory('dummy-directory', [], ['ts']);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file3');
		expect((await files.next()).done).toEqual(true);
	});

	it('should return any files when no [] are passed', async () => {
		promisesMock.readdir.mockReturnValueOnce([
			{ name: 'file1', isDirectory: () => false },
			{ name: 'file2', isDirectory: () => false },
		]);
		extnameMock.mockReturnValueOnce('.ts').mockReturnValueOnce('.pdf');
		resolveMock.mockReturnValueOnce('dir').mockReturnValueOnce('dir/file1').mockReturnValueOnce('dir/file2');
		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should handle [] prefixed with and without a dot', async () => {
		promisesMock.readdir.mockReturnValueOnce([
			{ name: 'file1', isDirectory: () => false },
			{ name: 'file2', isDirectory: () => false },
		]);
		extnameMock.mockReturnValueOnce('ts').mockReturnValueOnce('.pdf');
		resolveMock.mockReturnValueOnce('dir').mockReturnValueOnce('dir/file1').mockReturnValueOnce('dir/file2');
		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});
});
