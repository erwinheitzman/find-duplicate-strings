import { Directory } from './directory';
import { promises, existsSync, statSync } from 'fs';
import { resolve, normalize, extname, join } from 'path';

jest.mock('./store');
jest.mock('fs');
jest.mock('path');

const promisesMock = ((promises as unknown) = { readdir: jest.fn(), realpath: jest.fn(), lstat: jest.fn() });
const existsSyncMock = existsSync as jest.Mock;
const isDirectoryMock = statSync as jest.Mock;
const resolveMock = resolve as jest.Mock;
const normalizeMock = normalize as jest.Mock;
const extnameMock = extname as jest.Mock;
const joinMock = join as jest.Mock;

describe('Directory', () => {
	beforeEach(() => {
		existsSyncMock.mockReturnValue(true);
		isDirectoryMock.mockReturnValue({ isDirectory: () => true });
		extnameMock.mockReturnValue('.txt');
	});

	it('should throw when the directory does not exist', () => {
		existsSyncMock.mockReturnValue(false);

		expect(() => new Directory('dummy-directory', [], [])).toThrowError(
			'Directory does not exist, please pass a valid path.'
		);
	});

	it('should throw when the path does not point to a directory', () => {
		isDirectoryMock.mockReturnValue({ isDirectory: () => false });

		expect(() => new Directory('dummy-directory', [], [])).toThrowError('Path does not point to a directory.');
	});

	it('should normalize the path', () => {
		jest.spyOn(process, 'cwd').mockReturnValue('/Users/Dummy-User/development/current-working-directory');
		resolveMock.mockReturnValue('/Users/Dummy-User/development/dummy-directory/');

		new Directory('../dummy-directory', [], []);

		expect(resolveMock).toBeCalledWith('/Users/Dummy-User/development/current-working-directory', '../dummy-directory');
		expect(normalize).toBeCalledWith('/Users/Dummy-User/development/dummy-directory/');
	});

	it('should return files', async () => {
		promisesMock.readdir.mockResolvedValue([
			{ name: 'file1', isDirectory: () => false, isSymbolicLink: () => false },
			{ name: 'file2', isDirectory: () => false, isSymbolicLink: () => false },
		]);
		normalizeMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir').mockReturnValueOnce('dir/file1').mockReturnValueOnce('dir/file2');
		joinMock.mockReturnValueOnce('dir/file1').mockReturnValueOnce('dir/file2');
		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should recursively go trough directories', async () => {
		promisesMock.readdir
			.mockReturnValueOnce([{ name: 'sub-dir', isDirectory: () => true, isSymbolicLink: () => false }])
			.mockReturnValueOnce([
				{ name: 'sub-dir-file1', isDirectory: () => false, isSymbolicLink: () => false },
				{ name: 'sub-dir-file2', isDirectory: () => false, isSymbolicLink: () => false },
				{ name: 'file2', isDirectory: () => false, isSymbolicLink: () => false },
			]);
		resolveMock
			.mockReturnValueOnce('dir')
			.mockReturnValueOnce('dir/sub-dir')
			.mockReturnValueOnce('dir/sub-dir-file1')
			.mockReturnValueOnce('dir/sub-dir-file2')
			.mockReturnValueOnce('dir/file2');
		joinMock
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

	it('should exclude files/directories matching "file1"', async () => {
		promisesMock.readdir.mockReturnValueOnce([
			{ name: 'file1', isDirectory: () => false, isSymbolicLink: () => false },
			{ name: 'file2', isDirectory: () => false, isSymbolicLink: () => false },
		]);
		resolveMock.mockReturnValueOnce('dir').mockReturnValueOnce('dir/file2');
		joinMock.mockReturnValueOnce('dir/file2');

		const directory = new Directory('dummy-directory', ['file1'], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should return files matching file extension "ts"', async () => {
		promisesMock.readdir.mockReturnValueOnce([
			{ name: 'file1', isDirectory: () => false, isSymbolicLink: () => false },
			{ name: 'file2', isDirectory: () => false, isSymbolicLink: () => false },
			{ name: 'file3', isDirectory: () => false, isSymbolicLink: () => false },
		]);
		extnameMock.mockReturnValueOnce('.ts').mockReturnValueOnce('.txt').mockReturnValueOnce('.ts');
		resolveMock
			.mockReturnValueOnce('dir')
			.mockReturnValueOnce('dir/file1')
			.mockReturnValueOnce('dir/file2')
			.mockReturnValueOnce('dir/file3');
		joinMock.mockReturnValueOnce('dir/file1').mockReturnValueOnce('dir/file2').mockReturnValueOnce('dir/file3');
		const directory = new Directory('dummy-directory', [], ['ts']);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file3');
		expect((await files.next()).done).toEqual(true);
	});

	it('should return any files when no [] are passed', async () => {
		promisesMock.readdir.mockReturnValueOnce([
			{ name: 'file1', isDirectory: () => false, isSymbolicLink: () => false },
			{ name: 'file2', isDirectory: () => false, isSymbolicLink: () => false },
		]);
		extnameMock.mockReturnValueOnce('.ts').mockReturnValueOnce('.pdf');
		resolveMock.mockReturnValueOnce('dir').mockReturnValueOnce('dir/file1').mockReturnValueOnce('dir/file2');
		joinMock.mockReturnValueOnce('dir/file1').mockReturnValueOnce('dir/file2');
		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should handle [] prefixed with and without a dot', async () => {
		promisesMock.readdir.mockReturnValueOnce([
			{ name: 'file1', isDirectory: () => false, isSymbolicLink: () => false },
			{ name: 'file2', isDirectory: () => false, isSymbolicLink: () => false },
		]);
		extnameMock.mockReturnValueOnce('ts').mockReturnValueOnce('.pdf');
		resolveMock.mockReturnValueOnce('dir').mockReturnValueOnce('dir/file1').mockReturnValueOnce('dir/file2');
		joinMock.mockReturnValueOnce('dir/file1').mockReturnValueOnce('dir/file2');
		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should handle symlinks', async () => {
		promisesMock.readdir
			.mockReturnValueOnce([{ name: 'sub-dir', isDirectory: () => false, isSymbolicLink: () => true }])
			.mockReturnValueOnce([
				{ name: 'sub-dir-file1', isDirectory: () => false, isSymbolicLink: () => false },
				{ name: 'sub-dir-file2', isDirectory: () => false, isSymbolicLink: () => false },
				{ name: 'file2', isDirectory: () => false, isSymbolicLink: () => true },
			]);
		promisesMock.realpath
			.mockResolvedValueOnce('../../sub-dir/symlink/path')
			.mockResolvedValueOnce('../../sub-dir/symlink/path/file2');
		promisesMock.lstat
			.mockResolvedValueOnce({ isDirectory: () => true })
			.mockResolvedValueOnce({ isDirectory: () => false })
			.mockResolvedValueOnce({ isDirectory: () => false })
			.mockResolvedValueOnce({ isDirectory: () => false });
		resolveMock
			.mockReturnValueOnce('dir')
			.mockReturnValueOnce('../../sub-dir/symlink/path')
			.mockReturnValueOnce('../../sub-dir/symlink/path/sub-dir-file1')
			.mockReturnValueOnce('../../sub-dir/symlink/path/sub-dir-file2')
			.mockReturnValueOnce('dir/file2');
		joinMock
			.mockReturnValueOnce('../../sub-dir/symlink/path')
			.mockReturnValueOnce('../../sub-dir/symlink/path/sub-dir-file1')
			.mockReturnValueOnce('../../sub-dir/symlink/path/sub-dir-file2')
			.mockReturnValueOnce('dir/file2');
		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual('../../sub-dir/symlink/path/sub-dir-file1');
		expect((await files.next()).value).toEqual('../../sub-dir/symlink/path/sub-dir-file2');
		expect((await files.next()).value).toEqual('../../sub-dir/symlink/path/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should check for the isDirectory method on the dirent when the file/directory is not a symbolic link', async () => {
		const isDirentDirectoryMock = jest.fn().mockReturnValue(true);
		const isLstatDirectoryMock = jest.fn().mockReturnValue(true);
		promisesMock.readdir
			.mockResolvedValueOnce([{ name: 'sub-dir', isDirectory: isDirentDirectoryMock, isSymbolicLink: () => false }])
			.mockResolvedValueOnce([]);
		promisesMock.lstat.mockResolvedValueOnce({ isDirectory: isLstatDirectoryMock });

		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		await files.next();
		await files.next();

		expect(isDirentDirectoryMock).toBeCalledTimes(1);
		expect(isLstatDirectoryMock).toBeCalledTimes(0);
	});

	it('should check for the isDirectory method on the lstat object when the file/directory is a symbolic link', async () => {
		const isDirentDirectoryMock = jest.fn().mockReturnValue(true);
		const isLstatDirectoryMock = jest.fn().mockReturnValue(true);
		promisesMock.readdir
			.mockReturnValueOnce([{ name: 'sub-dir', isDirectory: isDirentDirectoryMock, isSymbolicLink: () => true }])
			.mockResolvedValueOnce([]);
		promisesMock.lstat.mockResolvedValueOnce({ isDirectory: isLstatDirectoryMock });

		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		await files.next();
		await files.next();

		expect(isDirentDirectoryMock).toBeCalledTimes(0);
		expect(isLstatDirectoryMock).toBeCalledTimes(1);
	});

	it('should ignore broken symlinks', async () => {
		promisesMock.readdir.mockReturnValueOnce([{ name: 'file1', isDirectory: () => false, isSymbolicLink: () => true }]);
		promisesMock.realpath.mockRejectedValueOnce({ message: 'ENOENT' } as Error);
		resolveMock.mockReturnValueOnce('dir').mockReturnValueOnce('dir/file2');
		joinMock.mockReturnValueOnce('dir/file2');

		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		expect((await files.next()).value).toEqual(undefined);
		expect((await files.next()).done).toEqual(true);
	});

	it('should throw when realpath throws an error other then "ENOENT"', async () => {
		promisesMock.readdir.mockReturnValueOnce([{ name: 'file1', isDirectory: () => false, isSymbolicLink: () => true }]);
		promisesMock.realpath.mockRejectedValueOnce({ message: 'foo' } as Error);
		resolveMock.mockReturnValueOnce('dir').mockReturnValueOnce('dir/file2');
		joinMock.mockReturnValueOnce('dir/file2');

		const directory = new Directory('dummy-directory', [], []);

		const files = directory.getFiles();

		expect(async () => await files.next()).rejects.toThrowError('foo');
	});
});
