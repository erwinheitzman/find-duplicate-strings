/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Scanner } from './scanner';
import {
	DirectoryQuestion,
	ExclusionsQuestion,
	ExtensionsQuestion,
	ConfirmDirectoryQuestion,
	ConfirmScannedDirQuestion,
} from './cli/questions';
import { Output } from './output';
import { Directory } from './directory';
import { Store } from './store';
import { File } from './file';

jest.mock('./cli/questions');
jest.mock('./directory');
// jest.mock('./output');
jest.mock('./store');
jest.mock('./file');
jest.mock('fs');
// jest.mock('./output', () =>
// 	jest.fn().mockImplementation(() =>
// 		({ output: () => {} })
// 	)
// );
jest.mock('./output', () => {
	// Works and lets you check for constructor calls:
	return {
		Output: jest.fn().mockImplementation(() => {
			return { output: jest.fn() };
		}),
	};
});

let getAll: jest.Mock<any, any>;
let getStrings: jest.Mock<any, any>;
let getFiles: jest.Mock<any, any>;
let confirmDirAnswer: jest.Mock<any, any>;
let confirmScannedDirAnswer: jest.Mock<any, any>;

describe('Scanner', () => {
	beforeEach(() => {
		getAll = Store.prototype.getAll = jest.fn().mockReturnValue([{ count: 1 }]);
		getStrings = File.prototype.getStrings = jest.fn();
		getFiles = Directory.prototype.getFiles = jest.fn().mockReturnValue([]);
		confirmDirAnswer = ConfirmDirectoryQuestion.prototype.getAnswer = jest.fn().mockResolvedValue(false);
		confirmScannedDirAnswer = ConfirmScannedDirQuestion.prototype.getAnswer = jest.fn().mockResolvedValue(false);

		ExclusionsQuestion.prototype.getAnswer = jest.fn().mockResolvedValue(['yes']);
		ExtensionsQuestion.prototype.getAnswer = jest.fn().mockResolvedValue(['no']);
		DirectoryQuestion.prototype.getAnswer = jest.fn().mockResolvedValue(['dummy']);
		Output.prototype.output = jest.fn();
		// return jest.fn().mockImplementation(() => {
		// 	return {playSoundFile: () => {}};
		// });
		console.log = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should enable silent mode', async () => {
		// act
		const scanner = new Scanner({ silent: true });

		// assert
		expect(scanner['silent']).toEqual(true);
	});

	it('should disable silent mode', async () => {
		// act
		const scanner = new Scanner({ silent: false });

		// assert
		expect(scanner['silent']).toEqual(false);
	});

	it('should set exlusions', async () => {
		// act
		const scanner = new Scanner({ exclusions: 'one,two,three' });

		// assert
		expect(scanner['exclusions']).toEqual(['one', 'two', 'three']);
	});

	it('should ask a question when exlusions are not provided', async () => {
		// arrange
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(ExclusionsQuestion.prototype.getAnswer).toBeCalledTimes(1);
	});

	it('should set extensions', async () => {
		// act
		const scanner = new Scanner({ extensions: 'one,two,three' });

		// assert
		expect(scanner['extensions']).toEqual(['one', 'two', 'three']);
	});

	it('should ask a question when extensions are not provided', async () => {
		// arrange
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(ExtensionsQuestion.prototype.getAnswer).toBeCalledTimes(1);
	});

	it('should set path', async () => {
		// arrange
		const scanner = new Scanner({ path: './some/path' });

		// act
		await scanner.scan();

		// assert
		expect(scanner['path']).toEqual('./some/path');
	});

	it('should not ask a question when the path is provided', async () => {
		// arrange
		const scanner = new Scanner({ path: './some/path' });

		// act
		await scanner.scan();

		// assert
		expect(DirectoryQuestion.prototype.getAnswer).toBeCalledTimes(0);
	});

	it('should set path to an empty string when missing', async () => {
		// arrange
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(scanner['path']).toEqual('');
		expect(DirectoryQuestion.prototype.getAnswer).toBeCalledTimes(1);
	});

	it('should ask a question when the path is not provided', async () => {
		// arrange
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(DirectoryQuestion.prototype.getAnswer).toBeCalledTimes(1);
	});

	it('should create a file instance', async () => {
		// arrange
		getFiles.mockReturnValue([{}, {}, {}, {}]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(getStrings).toHaveBeenCalledTimes(4);
	});

	it('should log a message to the console when no results are found', async () => {
		// arrange
		getAll.mockReturnValue([]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(console.log).toHaveBeenCalledWith('No duplicates where found.');
	});

	it('should not trigger an output when no results are found', async () => {
		// arrange
		getAll.mockReturnValue([]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(Output.prototype.output).not.toHaveBeenCalled();
	});

	it('should log a message to the console when results are found but the counts are lower then the threshold', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 0 }]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(console.log).toHaveBeenCalledWith('No duplicates where found.');
	});

	it('should not trigger an output when results are found but the counts are lower then the threshold', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 0 }]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(Output.prototype.output).not.toHaveBeenCalled();
	});

	it('should log a message to the console when results are found but the counts are equal to the threshold', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 1 }]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(console.log).toHaveBeenCalledWith('No duplicates where found.');
	});

	it('should not trigger an output when results are found but the counts are equal to the threshold', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 1 }]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(Output.prototype.output).not.toHaveBeenCalled();
	});

	it('should not log a message to the console when duplicates are found and the counts are higher then the threshold', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 2 }]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(console.log).not.toHaveBeenCalledTimes(1);
	});

	it('should trigger an output when duplicates are found and the counts are higher then the threshold', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 2 }]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(Output.prototype.output).toHaveBeenCalledTimes(1);
	});

	it('should ask if you want to scan the same directory twice', async () => {
		// arrange
		confirmScannedDirAnswer.mockResolvedValue(false);
		getFiles.mockReturnValue([]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();
		await scanner.scan();

		// assert
		expect(confirmScannedDirAnswer).toHaveBeenCalledTimes(1);
		expect(getFiles).toHaveBeenCalledTimes(1);
	});

	it('should re-scan directory when confirmed', async () => {
		// arrange
		confirmScannedDirAnswer.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
		getFiles.mockReturnValue([]);
		const scanner = new Scanner({});

		// act
		await scanner.scan();
		await scanner.scan();

		// assert
		expect(getFiles).toHaveBeenCalledTimes(2);
	});

	it('should ask if you want to scan another directory', async () => {
		// arrange
		confirmDirAnswer.mockResolvedValueOnce(false);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(confirmDirAnswer).toHaveBeenCalledTimes(1);
	});

	it('should re-ask if you want to scan another directory', async () => {
		// arrange
		confirmDirAnswer.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(confirmDirAnswer).toHaveBeenCalledTimes(2);
	});

	it('should set a threshold when passing threshold as a number', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 5 }]);
		const scanner = new Scanner({ threshold: 3 });

		// act
		await scanner.scan();

		// assert
		expect(scanner['threshold']).toEqual(3);
		expect((Output as jest.Mock<any, any>).mock.calls[0][0]).toEqual([{ count: 5 }]);
	});

	it('should set a threshold when passing threshold as a string', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 5 }]);
		const scanner = new Scanner({ threshold: '3' });

		// act
		await scanner.scan();

		// assert
		expect(scanner['threshold']).toEqual(3);
		expect((Output as jest.Mock<any, any>).mock.calls[0][0]).toEqual([{ count: 5 }]);
	});

	it('should set a threshold when passing threshold as a float', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 5 }]);
		const scanner = new Scanner({ threshold: '3.66' });

		// act
		await scanner.scan();

		// assert
		expect(scanner['threshold']).toEqual(3);
		expect((Output as jest.Mock<any, any>).mock.calls[0][0]).toEqual([{ count: 5 }]);
	});

	it('should set the threshold to 1 by default', async () => {
		// arrange
		const scanner = new Scanner({});

		// act
		await scanner.scan();

		// assert
		expect(scanner['threshold']).toEqual(1);
	});
});
