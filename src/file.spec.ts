import { File } from './file';
import { Store } from './store';
import { createReadStream } from 'fs';
import { emptyFile, emptyStringsFile, noStringsFile, file1, file2, file3 } from './file.mocks';

const path = 'dummy/path/';

jest.mock('./store');
jest.mock('fs');
jest.mock('path', () => ({
	resolve: () => path,
}));

const findMock = Store.find as jest.Mock;
const createReadStreamMock = createReadStream as jest.Mock;

describe('File', () => {
	it('should add matches to store', async () => {
		createReadStreamMock.mockImplementationOnce(file1);
		findMock.mockReturnValue(null);

		await new File(path).processContent();

		expect(Store.add).toBeCalledTimes(2);
		expect(Store.update).toBeCalledTimes(0);
		expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 1 });
		expect(Store.add).toHaveBeenNthCalledWith(2, 'bar', { key: 'bar', files: [path], count: 1 });
	});

	it('should update matches in store', async () => {
		createReadStreamMock.mockImplementationOnce(file1);
		findMock.mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce({ count: 1, files: [] });

		await new File(path).processContent();

		expect(Store.add).toBeCalledTimes(0);
		expect(Store.update).toBeCalledTimes(2);
		expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 2 });
		expect(Store.update).toHaveBeenNthCalledWith(2, 'bar', { key: 'bar', files: [path], count: 2 });
	});

	it('should not store empty string values', async () => {
		createReadStreamMock.mockImplementationOnce(emptyStringsFile);
		findMock.mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce({ count: 1, files: [] });

		await new File(path).processContent();

		expect(Store.add).toBeCalledTimes(0);
		expect(Store.update).toBeCalledTimes(0);
	});

	it('should not store the same path path twice', async () => {
		createReadStreamMock.mockImplementationOnce(file2);
		findMock
			.mockReturnValueOnce(null)
			.mockReturnValueOnce({ count: 1, files: [path] })
			.mockReturnValueOnce({ count: 2, files: [path] });

		await new File(path).processContent();

		expect(Store.add).toBeCalledTimes(1);
		expect(Store.update).toBeCalledTimes(2);
		expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 1 });
		expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 2 });
		expect(Store.update).toHaveBeenNthCalledWith(2, 'foo', { key: 'foo', files: [path], count: 3 });
	});

	it('should store all matches', async () => {
		createReadStreamMock.mockImplementationOnce(file3);
		findMock.mockReturnValueOnce(null).mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce(null);

		await new File(path).processContent();

		expect(Store.add).toBeCalledTimes(2);
		expect(Store.update).toBeCalledTimes(1);
		expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 1 });
		expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 2 });
		expect(Store.add).toHaveBeenNthCalledWith(2, 'bar', { key: 'bar', files: [path], count: 1 });
	});

	it('should not call the store when there are no strings/matches', async () => {
		createReadStreamMock.mockImplementationOnce(noStringsFile);

		await new File(path).processContent();

		expect(Store.add).toBeCalledTimes(0);
		expect(Store.update).toBeCalledTimes(0);
		expect(Store.find).toBeCalledTimes(0);
	});

	it('should not call the store when the file is empty', async () => {
		createReadStreamMock.mockImplementationOnce(emptyFile);

		await new File(path).processContent();

		expect(Store.add).toBeCalledTimes(0);
		expect(Store.update).toBeCalledTimes(0);
		expect(Store.find).toBeCalledTimes(0);
	});
});
