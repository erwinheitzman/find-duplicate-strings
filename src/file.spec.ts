/* eslint @typescript-eslint/no-explicit-any: 0 */

import { File } from './file';
import { resolve } from 'path';
import { Store } from './store';
import { createReadStream } from 'fs';
import { file1, file2, file3, file4 } from './file.mocks';

jest.mock('./store');
jest.mock('fs', () => ({
	createReadStream: jest.fn(),
}));

let findMock: jest.Mock<any, any>;
let createReadStreamMock: jest.Mock<any, any>;

const path = resolve(__dirname, '..', 'data', 'one.js');

const resultObject = {
	key: 'foo',
	files: [path],
	count: 1,
};

describe('File', () => {
	beforeEach(() => {
		createReadStreamMock = createReadStream as jest.Mock<any, any>;
		findMock = Store.find as jest.Mock<any, any>;
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should add matches to store', async (done) => {
		// arrange
		createReadStreamMock.mockImplementationOnce(file1);
		findMock.mockReturnValue(null);

		// act
		const rl = new File(path).processContent();

		// assert
		rl.on('close', () => {
			expect(Store.add).toBeCalledTimes(2);
			expect(Store.update).toBeCalledTimes(0);
			expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', resultObject);
			expect(Store.add).toHaveBeenNthCalledWith(2, 'bar', { ...resultObject, key: 'bar' });
			done();
		});
	});

	it('should update matches in store', async (done) => {
		// arrange
		createReadStreamMock.mockImplementationOnce(file1);
		findMock.mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce({ count: 1, files: [] });

		// act
		const rl = new File(path).processContent();

		// assert
		rl.on('close', () => {
			expect(Store.add).toBeCalledTimes(0);
			expect(Store.update).toBeCalledTimes(2);
			expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { ...resultObject, count: 2 });
			expect(Store.update).toHaveBeenNthCalledWith(2, 'bar', { ...resultObject, key: 'bar', count: 2 });
			done();
		});
	});

	it('should not store empty string values', async (done) => {
		// arrange
		createReadStreamMock.mockImplementationOnce(file2);
		findMock.mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce({ count: 1, files: [] });

		// act
		const rl = new File(path).processContent();

		// assert
		rl.on('close', () => {
			expect(Store.add).toBeCalledTimes(0);
			expect(Store.update).toBeCalledTimes(0);
			done();
		});
	});

	it('should not store the same path path twice', async (done) => {
		// arrange
		createReadStreamMock.mockImplementationOnce(file3);
		findMock
			.mockReturnValueOnce(null)
			.mockReturnValueOnce({ count: 1, files: [path] })
			.mockReturnValueOnce({ count: 2, files: [path] });

		// act
		const rl = new File(path).processContent();

		// assert
		rl.on('close', () => {
			expect(Store.add).toBeCalledTimes(1);
			expect(Store.update).toBeCalledTimes(2);
			expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', resultObject);
			expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { ...resultObject, count: 2 });
			expect(Store.update).toHaveBeenNthCalledWith(2, 'foo', { ...resultObject, count: 3 });
			done();
		});
	});

	it('should store all matches', async (done) => {
		// arrange
		createReadStreamMock.mockImplementationOnce(file4);
		findMock.mockReturnValueOnce(null).mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce(null);

		// act
		const rl = new File(path).processContent();

		// assert
		rl.on('close', () => {
			expect(Store.add).toBeCalledTimes(2);
			expect(Store.update).toBeCalledTimes(1);
			expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', resultObject);
			expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { ...resultObject, count: 2 });
			expect(Store.add).toHaveBeenNthCalledWith(2, 'bar', { ...resultObject, key: 'bar' });
			done();
		});
	});
});
