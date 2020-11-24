/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Directory } from './directory';
import { promises, existsSync, statSync } from 'fs';
import { resolve, extname } from 'path';

interface Dirent {
	name: string;
	isDirectory: () => boolean;
}

let readdirMock: jest.Mock<any, Dirent[]>;
let existsSyncMock: jest.Mock<any, any>;
let isDirectoryMock: jest.Mock<any, any>;
let resolveMock: jest.Mock<any, any>;
let extnameMock: jest.Mock<any, any>;

const dataDir = 'dummy';
const exclusions: string[] = [];
const extensions: string[] = [];

jest.mock('./store');
jest.mock('fs', () => ({
	promises: {
		readdir: jest.fn(),
	},
	existsSync: jest.fn().mockReturnValue(true),
	statSync: jest.fn().mockReturnValue({
		isDirectory: jest.fn(),
	}),
}));
jest.mock('path');

describe('Directory', () => {
	beforeEach(() => {
		readdirMock = promises.readdir as jest.Mock<any, any>;
		existsSyncMock = (existsSync as jest.Mock<any, any>).mockReturnValue(true);
		isDirectoryMock = (statSync as jest.Mock<any, any>).mockReturnValue({
			isDirectory: jest.fn().mockReturnValue(true),
		});
		resolveMock = resolve as jest.Mock<any, any>;
		extnameMock = (extname as jest.Mock<any, any>).mockReturnValue('.txt');
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should throw when the directory does not exist', () => {
		// arrange
		existsSyncMock.mockReturnValue(false);

		// act and assert
		expect(() => new Directory(dataDir, exclusions, extensions)).toThrowError(
			'Directory does not exist, please pass a valid path.',
		);
	});

	it('should throw when the path does not point to a directory', () => {
		// arrange
		isDirectoryMock.mockReturnValue({ isDirectory: () => false });

		// act and assert
		expect(() => new Directory(dataDir, exclusions, extensions)).toThrowError('Path does not point to a directory.');
	});

	it('should return files', async () => {
		// arrange
		readdirMock.mockResolvedValue([
			{ name: 'file1', isDirectory: jest.fn().mockReturnValue(false) },
			{ name: 'file2', isDirectory: jest.fn().mockReturnValue(false) },
		]);
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/file1');
		resolveMock.mockReturnValueOnce('dir/file2');
		const directory = new Directory(dataDir, exclusions, extensions);

		// act
		const files = directory.getFiles();

		// assert
		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should recursively go trough directories', async () => {
		// arrange
		readdirMock
			.mockReturnValueOnce([{ name: 'sub-dir', isDirectory: jest.fn().mockReturnValue(true) }])
			.mockReturnValueOnce([
				{ name: 'sub-dir-file1', isDirectory: jest.fn().mockReturnValue(false) },
				{ name: 'sub-dir-file2', isDirectory: jest.fn().mockReturnValue(false) },
				{ name: 'file2', isDirectory: jest.fn().mockReturnValue(false) },
			]);
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/sub-dir');
		resolveMock.mockReturnValueOnce('dir/sub-dir-file1');
		resolveMock.mockReturnValueOnce('dir/sub-dir-file2');
		resolveMock.mockReturnValueOnce('dir/file2');
		const directory = new Directory(dataDir, exclusions, extensions);

		// act
		const files = directory.getFiles();

		// assert
		expect((await files.next()).value).toEqual('dir/sub-dir-file1');
		expect((await files.next()).value).toEqual('dir/sub-dir-file2');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should exlude files/directories matching "file1"', async () => {
		// arrange
		readdirMock.mockReturnValueOnce([
			{ name: 'file1', isDirectory: jest.fn().mockReturnValue(false) },
			{ name: 'file2', isDirectory: jest.fn().mockReturnValue(false) },
		]);
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/file2'); // file 1 wil be skipped
		const directory = new Directory(dataDir, ['file1'], extensions);

		// act
		const files = directory.getFiles();

		// assert
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should return files matching file extension "ts"', async () => {
		// arrange
		readdirMock.mockReturnValueOnce([
			{ name: 'file1', isDirectory: jest.fn().mockReturnValue(false) },
			{ name: 'file2', isDirectory: jest.fn().mockReturnValue(false) },
			{ name: 'file3', isDirectory: jest.fn().mockReturnValue(false) },
		]);
		extnameMock.mockReturnValueOnce('.ts').mockReturnValueOnce('.txt').mockReturnValueOnce('.ts');
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/file1');
		resolveMock.mockReturnValueOnce('dir/file2');
		resolveMock.mockReturnValueOnce('dir/file3');
		const directory = new Directory(dataDir, exclusions, ['ts']);

		// act
		const files = directory.getFiles();

		// assert
		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file3');
		expect((await files.next()).done).toEqual(true);
	});

	it('should return any files when no extensions are passed', async () => {
		// arrange
		readdirMock.mockReturnValueOnce([
			{ name: 'file1', isDirectory: jest.fn().mockReturnValue(false) },
			{ name: 'file2', isDirectory: jest.fn().mockReturnValue(false) },
		]);
		extnameMock.mockReturnValueOnce('.ts').mockReturnValueOnce('.pdf');
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/file1');
		resolveMock.mockReturnValueOnce('dir/file2');
		const directory = new Directory(dataDir, exclusions, extensions);

		// act
		const files = directory.getFiles();

		// assert
		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});

	it('should handle extensions prefixed with and without a dot', async () => {
		// arrange
		readdirMock.mockReturnValueOnce([
			{ name: 'file1', isDirectory: jest.fn().mockReturnValue(false) },
			{ name: 'file2', isDirectory: jest.fn().mockReturnValue(false) },
		]);
		extnameMock.mockReturnValueOnce('ts').mockReturnValueOnce('.pdf');
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/file1');
		resolveMock.mockReturnValueOnce('dir/file2');
		const directory = new Directory(dataDir, exclusions, extensions);

		// act
		const files = await directory.getFiles();

		// assert
		expect((await files.next()).value).toEqual('dir/file1');
		expect((await files.next()).value).toEqual('dir/file2');
		expect((await files.next()).done).toEqual(true);
	});
});
