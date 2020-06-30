import { File } from './file';
import { resolve } from 'path';
import { Store } from './store';
import { Finding } from './ifinding';
import { readFileSync } from 'fs';

jest.mock('./store');
jest.mock('fs');

const dataDir = resolve(__dirname, '..', 'data');
const store = new Store<Finding>();
let findMock: jest.Mock<any, any>;
let readFileSyncMock: jest.Mock<any, any>;

const dummyFile1 =
	`describe('', () => {\n` +
	`    it("", () => {\n` +
	`        const foo = "foo";\n` +
	`        const bar = 'bar';\n` +
	`        const baz = \`baz\`;\n` +
	`    });\n` +
	`});\n`;

const dummyFile2 =
	`describe('', () => {\n` +
	`    it("", () => {\n` +
	`        let foo = "foo";\n` +
	`        foo = "foo";\n` +
	`        foo = "foo";\n` +
	`    });\n` +
	`});\n`;

describe('File', () => {
	beforeEach(() => {
		readFileSyncMock = readFileSync as jest.Mock<any, any>;
		findMock = store.find as jest.Mock<any, any>;
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should add matches to store', () => {
		// arrange
		readFileSyncMock.mockReturnValue(dummyFile1);
		findMock.mockReturnValue(null);
		const file = new File(store, resolve(dataDir, 'one.js'));
		const findingObj = {
			count: 1,
			files: ['C:\\dev\\find-duplicate-strings\\data\\one.js'],
			key: 'foo',
		};

		// act
		file.getStrings();

		// assert
		expect(store.add).toBeCalledTimes(2);
		expect(store.update).toBeCalledTimes(0);
		expect(store.add).toHaveBeenNthCalledWith(1, 'foo', findingObj);
		expect(store.add).toHaveBeenNthCalledWith(2, 'bar', { ...findingObj, key: 'bar' });
	});

	it('should update matches in store', () => {
		// arrange
		readFileSyncMock.mockReturnValue(dummyFile1);
		findMock.mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce({ count: 1, files: [] });
		const file = new File(store, resolve(dataDir, 'one.js'));
		const findingObj = {
			count: 2,
			files: ['C:\\dev\\find-duplicate-strings\\data\\one.js'],
			key: 'foo',
		};

		// act
		file.getStrings();

		// assert
		expect(store.add).toBeCalledTimes(0);
		expect(store.update).toBeCalledTimes(2);
		expect(store.update).toHaveBeenNthCalledWith(1, 'foo', findingObj);
		expect(store.update).toHaveBeenNthCalledWith(2, 'bar', { ...findingObj, key: 'bar' });
	});

	it('should not store empty string values', () => {
		// arrange
		readFileSyncMock.mockReturnValue(`describe('', () => {\n` + `    it("", () => {\n` + `    });\n` + `});\n`);
		findMock.mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce({ count: 1, files: [] });
		const file = new File(store, resolve(dataDir, 'one.js'));

		// act
		file.getStrings();

		// assert
		expect(store.add).toBeCalledTimes(0);
		expect(store.update).toBeCalledTimes(0);
	});

	it('should not store the same path path twice', () => {
		// arrange
		readFileSyncMock.mockReturnValue(dummyFile2);
		findMock
			.mockReturnValueOnce(null)
			.mockReturnValueOnce({ count: 1, files: ['C:\\dev\\find-duplicate-strings\\data\\one.js'] })
			.mockReturnValueOnce({ count: 2, files: ['C:\\dev\\find-duplicate-strings\\data\\one.js'] });
		const file = new File(store, resolve(dataDir, 'one.js'));
		const findingObj = {
			count: 1,
			files: ['C:\\dev\\find-duplicate-strings\\data\\one.js'],
			key: 'foo',
		};

		// act
		file.getStrings();

		// assert
		expect(store.add).toBeCalledTimes(1);
		expect(store.update).toBeCalledTimes(2);
		expect(store.add).toHaveBeenNthCalledWith(1, 'foo', findingObj);
		expect(store.update).toHaveBeenNthCalledWith(1, 'foo', { ...findingObj, count: 2 });
		expect(store.update).toHaveBeenNthCalledWith(2, 'foo', { ...findingObj, count: 3 });
	});

	it('should store all matches', () => {
		// arrange
		readFileSyncMock.mockReturnValue(`const foo = "foo";\n\n` + dummyFile1);
		findMock.mockReturnValueOnce(null).mockReturnValueOnce({ count: 1, files: [] }).mockReturnValueOnce(null);
		const file = new File(store, resolve(dataDir, 'one.js'));
		const findingObj = {
			count: 1,
			files: ['C:\\dev\\find-duplicate-strings\\data\\one.js'],
			key: 'foo',
		};

		// act
		file.getStrings();

		// assert
		expect(store.add).toBeCalledTimes(2);
		expect(store.update).toBeCalledTimes(1);
		expect(store.add).toHaveBeenNthCalledWith(1, 'foo', findingObj);
		expect(store.update).toHaveBeenNthCalledWith(1, 'foo', { ...findingObj, count: 2 });
		expect(store.add).toHaveBeenNthCalledWith(2, 'bar', { ...findingObj, count: 1, key: 'bar' });
	});
});
