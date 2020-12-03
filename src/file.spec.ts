import { File } from './file';
import { Store } from './store';
import { createReadStream } from 'fs';
import { file1, file2, file3, file4 } from './file.mocks';

const path = 'dummy/path/';

jest.mock('./store');
jest.mock('fs');
jest.mock('path', () => ({
	resolve: () => path,
}));

const findMock = Store.find as jest.Mock<any, any>;
const createReadStreamMock = createReadStream as jest.Mock<any, any>;

describe('File', () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should add matches to store', async (done) => {
		createReadStreamMock.mockImplementationOnce(file1);
		findMock.mockReturnValue(null);

		const rl = new File(path).processContent();

		rl.on('close', () => {
			expect(Store.add).toBeCalledTimes(2);
			expect(Store.update).toBeCalledTimes(0);
			expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 1 });
			expect(Store.add).toHaveBeenNthCalledWith(2, 'bar', { key: 'bar', files: [path], count: 1 });
			done();
		});
	});

	it('should update matches in store', async (done) => {
		createReadStreamMock.mockImplementationOnce(file1);
		findMock.mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce({ count: 1, files: [] });

		const rl = new File(path).processContent();

		rl.on('close', () => {
			expect(Store.add).toBeCalledTimes(0);
			expect(Store.update).toBeCalledTimes(2);
			expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 2 });
			expect(Store.update).toHaveBeenNthCalledWith(2, 'bar', { key: 'bar', files: [path], count: 2 });
			done();
		});
	});

	it('should not store empty string values', async (done) => {
		createReadStreamMock.mockImplementationOnce(file2);
		findMock.mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce({ count: 1, files: [] });

		const rl = new File(path).processContent();

		rl.on('close', () => {
			expect(Store.add).toBeCalledTimes(0);
			expect(Store.update).toBeCalledTimes(0);
			done();
		});
	});

	it('should not store the same path path twice', async (done) => {
		createReadStreamMock.mockImplementationOnce(file3);
		findMock
			.mockReturnValueOnce(null)
			.mockReturnValueOnce({ count: 1, files: [path] })
			.mockReturnValueOnce({ count: 2, files: [path] });

		const rl = new File(path).processContent();

		rl.on('close', () => {
			expect(Store.add).toBeCalledTimes(1);
			expect(Store.update).toBeCalledTimes(2);
			expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 1 });
			expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 2 });
			expect(Store.update).toHaveBeenNthCalledWith(2, 'foo', { key: 'foo', files: [path], count: 3 });
			done();
		});
	});

	it('should store all matches', async (done) => {
		createReadStreamMock.mockImplementationOnce(file4);
		findMock.mockReturnValueOnce(null).mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce(null);

		const rl = new File(path).processContent();

		rl.on('close', () => {
			expect(Store.add).toBeCalledTimes(2);
			expect(Store.update).toBeCalledTimes(1);
			expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 1 });
			expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { key: 'foo', files: [path], count: 2 });
			expect(Store.add).toHaveBeenNthCalledWith(2, 'bar', { key: 'bar', files: [path], count: 1 });
			done();
		});
	});
});
