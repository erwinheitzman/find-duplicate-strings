/* eslint @typescript-eslint/no-explicit-any: 0 */

import { File } from './file';
import { resolve } from 'path';
import { Store } from './store';
import { createReadStream } from 'fs';
import { Readable } from 'stream';
// import { createInterface } from 'readline';

jest.mock('./store');
jest.mock('fs', () => ({
	createReadStream: jest.fn(),
}));
// jest.mock('fs', () => ({
// 	createInterface: jest.fn(),
// }));

const dataDir = resolve(__dirname, '..', 'data');
let findMock: jest.Mock<any, any>;
let createReadStreamMock: jest.Mock<any, any>;
// let createInterfaceMock: jest.Mock<any, any>;

const path = resolve(dataDir, 'one.js');

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
		createReadStreamMock.mockImplementationOnce(() => {
			const readable = new Readable({ encoding: 'utf8' });
			readable.push(`describe('', () => {`);
			readable.push(`    it("", () => {`);
			readable.push(`        const foo = "foo";`);
			readable.push(`        const bar = 'bar';`);
			readable.push(`        const baz = \`baz\`;`);
			readable.push(`    });`);
			readable.push(`});`);
			readable.push(null);
			return readable;
		});
		findMock.mockReturnValue(null);
		const file = new File(path);
		const findingObj = {
			count: 1,
			files: [path],
			key: 'foo',
		};

		// act
		file.getStrings();

		setTimeout(() => {
			expect(Store.add).toBeCalledTimes(2);
			expect(Store.update).toBeCalledTimes(0);
			expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', findingObj);
			expect(Store.add).toHaveBeenNthCalledWith(2, 'bar', { ...findingObj, key: 'bar' });
			done();
		}, 1000);
	});

	it('should update matches in store', async (done) => {
		// arrange
		createReadStreamMock.mockImplementationOnce(() => {
			const readable = new Readable({ encoding: 'utf8' });
			readable.push(`describe('', () => {`);
			readable.push(`    it("", () => {`);
			readable.push(`        const foo = "foo";`);
			readable.push(`        const bar = 'bar';`);
			readable.push(`        const baz = \`baz\`;`);
			readable.push(`    });`);
			readable.push(`});`);
			readable.push(null);
			return readable;
		});
		findMock.mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce({ count: 1, files: [] });
		const file = new File(path);
		const findingObj = {
			count: 2,
			files: [path],
			key: 'foo',
		};

		// act
		file.getStrings();

		// assert

		setTimeout(() => {
			expect(Store.add).toBeCalledTimes(0);
			expect(Store.update).toBeCalledTimes(2);
			expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', findingObj);
			expect(Store.update).toHaveBeenNthCalledWith(2, 'bar', { ...findingObj, key: 'bar' });
			done();
		}, 1000);
	});

	it('should not store empty string values', async (done) => {
		// arrange
		createReadStreamMock.mockImplementationOnce(() => {
			const readable = new Readable({ encoding: 'utf8' });
			readable.push(`describe('', () => {`);
			readable.push(`    it("", () => {`);
			readable.push(`    });`);
			readable.push(`});`);
			readable.push(null);
			return readable;
		});
		findMock.mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce({ count: 1, files: [] });
		const file = new File(path);

		// act
		file.getStrings();

		// assert

		setTimeout(() => {
			expect(Store.add).toBeCalledTimes(0);
			expect(Store.update).toBeCalledTimes(0);
			done();
		}, 1000);
	});

	it('should not store the same path path twice', async (done) => {
		// arrange
		createReadStreamMock.mockImplementationOnce(() => {
			const readable = new Readable({ encoding: 'utf8' });
			readable.push(`describe('', () => {`);
			readable.push(`    it("", () => {`);
			readable.push(`        let foo = "foo";`);
			readable.push(`        foo = "foo";`);
			readable.push(`        foo = "foo";`);
			readable.push(`    });`);
			readable.push(`});`);
			readable.push(null);
			return readable;
		});
		findMock
			.mockReturnValueOnce(null)
			.mockReturnValueOnce({ count: 1, files: [path] })
			.mockReturnValueOnce({ count: 2, files: [path] });
		const file = new File(path);
		const findingObj = {
			count: 1,
			files: [path],
			key: 'foo',
		};

		// act
		file.getStrings();

		// assert
		setTimeout(() => {
			expect(Store.add).toBeCalledTimes(1);
			expect(Store.update).toBeCalledTimes(2);
			expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', findingObj);
			expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { ...findingObj, count: 2 });
			expect(Store.update).toHaveBeenNthCalledWith(2, 'foo', { ...findingObj, count: 3 });
			done();
		}, 1000);
	});

	it('should store all matches', async (done) => {
		// arrange
		createReadStreamMock = (createReadStream as jest.Mock<any, any>).mockImplementationOnce(() => {
			const readable = new Readable({ encoding: 'utf8' });
			readable.push(`const foo = "foo";`);
			readable.push(``);
			readable.push(`describe('', () => {`);
			readable.push(`    it("", () => {`);
			readable.push(`        const foo = "foo";`);
			readable.push(`        const bar = 'bar';`);
			readable.push(`        const baz = \`baz\`;`);
			readable.push(`    });`);
			readable.push(`});`);
			readable.push(null);
			return readable;
		});
		findMock.mockReturnValueOnce(null).mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce(null);
		const file = new File(path);
		const findingObj = {
			count: 1,
			files: [path],
			key: 'foo',
		};

		// act
		file.getStrings();

		// assert
		setTimeout(() => {
			expect(Store.add).toBeCalledTimes(2);
			expect(Store.update).toBeCalledTimes(1);
			expect(Store.add).toHaveBeenNthCalledWith(1, 'foo', findingObj);
			expect(Store.update).toHaveBeenNthCalledWith(1, 'foo', { ...findingObj, count: 2 });
			expect(Store.add).toHaveBeenNthCalledWith(2, 'bar', { ...findingObj, count: 1, key: 'bar' });
			done();
		}, 1000);
	});
});
