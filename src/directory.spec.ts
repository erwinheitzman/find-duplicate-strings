/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Directory } from './directory';
import { readdirSync, existsSync, statSync } from 'fs';
import { resolve, extname } from 'path';

jest.mock('./store');
jest.mock('fs');
jest.mock('path');

let readdirSyncMock: jest.Mock<any, any>;
let existsSyncMock: jest.Mock<any, any>;
let statSyncMock: jest.Mock<any, any>;
let resolveMock: jest.Mock<any, any>;
let extnameMock: jest.Mock<any, any>;

const dataDir = 'dummy';
const exclusions: string[] = [];
const extensions: string[] = [];

describe('Directory', () => {
	beforeEach(() => {
		readdirSyncMock = (readdirSync as jest.Mock<any, any>).mockReturnValue(['file1', 'file2']);
		existsSyncMock = (existsSync as jest.Mock<any, any>).mockReturnValue(true);
		statSyncMock = (statSync as jest.Mock<any, any>).mockReturnValue({
			isDirectory: jest.fn().mockReturnValueOnce(true).mockReturnValue(false),
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
		statSyncMock.mockReturnValue({ isDirectory: jest.fn().mockReturnValue(false) });

		// act and assert
		expect(() => new Directory(dataDir, exclusions, extensions)).toThrowError('Path does not point to a directory.');
	});

	it('should return files', () => {
		// arrange
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/file1');
		resolveMock.mockReturnValueOnce('dir/file2');
		const directory = new Directory(dataDir, exclusions, extensions);

		// act
		const files = directory.getFiles();

		// assert
		expect(files).toEqual(['dir/file1', 'dir/file2']);
	});

	it('should recursively go trough directories', () => {
		// arrange
		readdirSyncMock.mockReturnValueOnce(['file1', 'file2']).mockReturnValueOnce(['sub-dir-file1', 'sub-dir-file2']);
		statSyncMock.mockReturnValue({
			isDirectory: jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValue(false),
		});
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/sub-dir');
		resolveMock.mockReturnValueOnce('dir/sub-dir-file1');
		resolveMock.mockReturnValueOnce('dir/sub-dir-file2');
		resolveMock.mockReturnValueOnce('dir/file2');
		const directory = new Directory(dataDir, exclusions, extensions);

		// act
		const files = directory.getFiles();

		// assert
		expect(files).toEqual(['dir/sub-dir-file1', 'dir/sub-dir-file2', 'dir/file2']);
	});

	it('should exlude files/directories matching "file1"', () => {
		// arrange
		resolveMock.mockReturnValueOnce('dir');
		// file 1 wil be skipped
		resolveMock.mockReturnValueOnce('dir/file2');
		const directory = new Directory(dataDir, ['file1'], extensions);

		// act
		const files = directory.getFiles();

		// assert
		expect(files).toEqual(['dir/file2']);
	});

	it('should return files matching file extension "ts"', () => {
		// arrange
		extnameMock.mockReturnValueOnce('.ts').mockReturnValueOnce('.txt');
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/file1');
		resolveMock.mockReturnValueOnce('dir/file2');
		const directory = new Directory(dataDir, exclusions, ['ts']);

		// act
		const files = directory.getFiles();

		// assert
		expect(files).toEqual(['dir/file1']);
	});

	it('should return any files when no extensions are passed', () => {
		// arrange
		extnameMock.mockReturnValueOnce('.ts').mockReturnValueOnce('.pdf');
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/file1');
		resolveMock.mockReturnValueOnce('dir/file2');
		const directory = new Directory(dataDir, exclusions, extensions);

		// act
		const files = directory.getFiles();

		// assert
		expect(files).toEqual(['dir/file1', 'dir/file2']);
	});

	it('should handle extensions prefixed with and without a dot', () => {
		// arrange
		extnameMock.mockReturnValueOnce('ts').mockReturnValueOnce('.pdf');
		resolveMock.mockReturnValueOnce('dir');
		resolveMock.mockReturnValueOnce('dir/file1');
		resolveMock.mockReturnValueOnce('dir/file2');
		const directory = new Directory(dataDir, exclusions, extensions);

		// act
		const files = directory.getFiles();

		// assert
		expect(files).toEqual(['dir/file1', 'dir/file2']);
	});
});
