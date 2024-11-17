import { existsSync } from 'node:fs';
import { globSync } from 'glob';

import { getFiles } from './getFiles.js';

jest.mock('glob');
jest.mock('node:fs');

describe('Directory', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.mocked(existsSync).mockReturnValue(true);
	});

	it('should return files', async () => {
		jest.mocked(globSync).mockReturnValue(['file1', 'file2']);
		const files = getFiles('dummy-directory', [], []);

		expect(files).toEqual(['file1', 'file2']);
	});

	it('should exclude file: file.log', async () => {
		jest.mocked(globSync).mockReturnValue(['file.log', 'file']);
		const files = getFiles('dummy-directory', ['file.log'], []);

		expect(files).toEqual(['file']);
	});

	it('should exclude files from directory: node_modules', async () => {
		jest.mocked(globSync).mockReturnValue(['./foo/node_modules/file.log', 'file']);
		const files = getFiles('dummy-directory', ['node_modules'], []);

		expect(files).toEqual(['file']);
	});

	it('should return .ts files', async () => {
		jest.mocked(globSync).mockReturnValue(['file1.ts', 'file2', 'file3.ts', 'file4.log']);
		const files = getFiles('dummy-directory', [], ['.ts']);

		expect(files).toEqual(['file1.ts', 'file3.ts']);
	});

	it('should return existing files only', async () => {
		jest
			.mocked(existsSync)
			.mockReturnValueOnce(false)
			.mockReturnValueOnce(true)
			.mockReturnValueOnce(false)
			.mockReturnValueOnce(true);
		jest.mocked(globSync).mockReturnValue(['file1.ts', 'file2', 'file3.ts', 'file4.log']);
		const files = getFiles('dummy-directory', [], []);

		expect(files).toEqual(['file2', 'file4.log']);
	});
});
