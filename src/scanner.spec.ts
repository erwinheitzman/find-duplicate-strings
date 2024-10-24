import { Scanner } from './scanner';
import {
	PathQuestion,
	ExclusionsQuestion,
	ExtensionsQuestion,
	ConfirmPathQuestion,
	ConfirmDuplicatePathQuestion,
	ThresholdQuestion,
} from './cli/questions';
import { Output } from './output';
import { Directory } from './directory';
import { Store } from './store';
import { File } from './file';
import { existsSync, statSync } from 'node:fs';
import { normalize, resolve } from 'node:path';

jest.mock('./cli/questions/confirm-path');
jest.mock('./cli/questions/confirm-duplicate-path');
jest.mock('./cli/questions/exclusions');
jest.mock('./cli/questions/extensions');
jest.mock('./cli/questions/threshold');
jest.mock('./cli/questions/path');
jest.mock('./directory');
jest.mock('./store');
jest.mock('./file');
jest.mock('node:fs');
jest.mock('node:path');
jest.mock('./output');
jest.mock('@inquirer/prompts');

const getAllMock = Store.getAll as jest.Mock;
const DirectoryGetFilesMock = Directory.prototype.getFiles as jest.Mock;
const FileProcessContentMock = File.prototype.processContent as jest.Mock;
const ConfirmPathQuestionMock = ConfirmPathQuestion.prototype.getAnswer as jest.Mock;
const ConfirmDuplicatePathQuestionMock = ConfirmDuplicatePathQuestion.prototype.getAnswer as jest.Mock;
const existsSyncMock = existsSync as jest.Mock;
const statSyncMock = (statSync as unknown as jest.Mock).mockReturnValue({ isFile: jest.fn(), isDirectory: jest.fn() });
const resolveMock = resolve as jest.Mock;
const normalizeMock = normalize as jest.Mock;

console.log = jest.fn();
process.stdout.clearLine = jest.fn();
process.stdout.cursorTo = jest.fn();
process.stdout.write = jest.fn();

const interval = 1;

jest.useFakeTimers();

describe('Scanner', () => {
	beforeEach(() => {
		jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
		FileProcessContentMock.mockImplementation(() => Promise.resolve);
		existsSyncMock.mockReturnValue(true);
		getAllMock.mockReturnValue([{ count: 1 }]);
		DirectoryGetFilesMock.mockReturnValue([]);
		ConfirmPathQuestionMock.mockResolvedValue(false);
		ConfirmDuplicatePathQuestionMock.mockResolvedValue(false);
		(ExclusionsQuestion.prototype.getAnswer as jest.Mock).mockResolvedValue('dummy-dir');
		(ExtensionsQuestion.prototype.getAnswer as jest.Mock).mockResolvedValue('.ts,.js');
		(PathQuestion.prototype.getAnswer as jest.Mock).mockResolvedValue(['dummy']);
		(ThresholdQuestion.prototype.getAnswer as jest.Mock).mockResolvedValue('1');
		statSyncMock.mockReturnValue({ isFile: () => true, isDirectory: () => false });
	});

	it('should enable interactive mode', async () => {
		const scanner = new Scanner({ interactive: true }, interval);

		expect(scanner['interactive']).toEqual(true);
	});

	it('should disable interactive mode', async () => {
		const scanner = new Scanner({ interactive: false }, interval);

		expect(scanner['interactive']).toEqual(false);
	});

	it('should set exclusions', async () => {
		const scanner = new Scanner({ exclusions: 'one,two,three' }, interval);

		expect(scanner['exclusions']).toEqual(['one', 'two', 'three']);
	});

	it('should ask a question when exclusions are not provided while interactive mode is enabled and the path does not point to a file', async () => {
		statSyncMock.mockReturnValue({ isFile: () => false, isDirectory: () => true });
		const scanner = new Scanner({ interactive: true }, interval);

		await scanner.scan();

		expect(ExclusionsQuestion.prototype.getAnswer).toHaveBeenCalledTimes(1);
	});

	it('should not ask a question when exclusions are not provided while interactive mode is disabled and the path does not point to a file', async () => {
		statSyncMock.mockReturnValue({ isFile: () => false, isDirectory: () => true });
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(ExclusionsQuestion.prototype.getAnswer).not.toHaveBeenCalled();
	});

	it('should set extensions', async () => {
		const scanner = new Scanner({ extensions: 'one,two,three' }, interval);

		expect(scanner['extensions']).toEqual(['one', 'two', 'three']);
	});

	it('should ask a question when extensions are not provided while interactive mode is enabled and the path does not point to a file', async () => {
		statSyncMock.mockReturnValue({ isFile: () => false, isDirectory: () => true });
		const scanner = new Scanner({ interactive: true }, interval);

		await scanner.scan();

		expect(ExtensionsQuestion.prototype.getAnswer).toHaveBeenCalledTimes(1);
	});

	it('should not ask a question when extensions are not provided while interactive mode is disabled and the path does not point to a file', async () => {
		statSyncMock.mockReturnValue({ isFile: () => false, isDirectory: () => true });
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(ExtensionsQuestion.prototype.getAnswer).not.toHaveBeenCalled();
	});

	it('should set a threshold when passing threshold as a number', async () => {
		getAllMock.mockReturnValue([{ count: 5 }]);
		const scanner = new Scanner({ threshold: 3 }, interval);

		await scanner.scan();

		expect(scanner['threshold']).toEqual(3);
		expect((Output as jest.Mock).mock.calls[0][0]).toEqual([{ count: 5 }]);
	});

	it('should set a threshold when passing threshold as a string', async () => {
		getAllMock.mockReturnValue([{ count: 5 }]);
		const scanner = new Scanner({ threshold: '3' }, interval);

		await scanner.scan();

		expect(scanner['threshold']).toEqual(3);
		expect((Output as jest.Mock).mock.calls[0][0]).toEqual([{ count: 5 }]);
	});

	it('should set a threshold when passing threshold as a float', async () => {
		getAllMock.mockReturnValue([{ count: 5 }]);
		const scanner = new Scanner({ threshold: '3.66' }, interval);

		await scanner.scan();

		expect(scanner['threshold']).toEqual(3);
		expect((Output as jest.Mock).mock.calls[0][0]).toEqual([{ count: 5 }]);
	});

	it('should ask a question when the threshold is not provided and interactive mode is enabled', async () => {
		const scanner = new Scanner({ interactive: true }, interval);

		await scanner.scan();

		expect(ThresholdQuestion.prototype.getAnswer).toHaveBeenCalledTimes(1);
	});

	it('should not ask a question when the threshold is not provided and interactive mode is disabled', async () => {
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(ThresholdQuestion.prototype.getAnswer).not.toHaveBeenCalled();
	});

	it('should set path', async () => {
		const scanner = new Scanner({ path: './some/path' }, interval);

		await scanner.scan();

		expect(scanner['path']).toEqual('./some/path');
	});

	it('should not ask a question when the path is provided', async () => {
		const scanner = new Scanner({ path: './some/path' }, interval);

		await scanner.scan();

		expect(PathQuestion.prototype.getAnswer).toHaveBeenCalledTimes(0);
	});

	it('should set path to an empty string when missing', async () => {
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(scanner['path']).toEqual('');
		expect(PathQuestion.prototype.getAnswer).toHaveBeenCalledTimes(1);
	});

	it('should ask a question when the path is not provided', async () => {
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(PathQuestion.prototype.getAnswer).toHaveBeenCalledTimes(1);
	});

	it('should scan all files found in the directory', async () => {
		statSyncMock.mockReturnValue({ isFile: () => false, isDirectory: () => true });
		DirectoryGetFilesMock.mockReturnValue([{}, {}, {}, {}]);
		const scanner = new Scanner({ path: '' }, interval);

		await scanner.scan();

		expect(FileProcessContentMock).toHaveBeenCalledTimes(4);
	});

	it('should scan the single file that is passed', async () => {
		FileProcessContentMock.mockReturnValue([{}]);
		const scanner = new Scanner({ path: '' }, interval);

		await scanner.scan();

		expect(FileProcessContentMock).toHaveBeenCalledTimes(1);
	});

	it('should log a message to the console when no results are found', async () => {
		getAllMock.mockReturnValue([]);
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(console.log).toHaveBeenCalledWith('No duplicates where found.');
	});

	it('should not trigger an output when no results are found', async () => {
		getAllMock.mockReturnValue([]);
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(Output.prototype.output).not.toHaveBeenCalled();
	});

	it('should log a message to the console when results are found but the counts are lower then the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 0 }]);
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(console.log).toHaveBeenCalledWith('No duplicates where found.');
	});

	it('should not trigger an output when results are found but the counts are lower then the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 0 }]);
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(Output.prototype.output).not.toHaveBeenCalled();
	});

	it('should log a message to the console when results are found but the counts are equal to the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 1 }]);
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(console.log).toHaveBeenCalledWith('No duplicates where found.');
	});

	it('should not trigger an output when results are found but the counts are equal to the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 1 }]);
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(Output.prototype.output).not.toHaveBeenCalled();
	});

	it('should not log a message to the console when duplicates are found and the counts are higher then the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 2 }]);
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(console.log).not.toHaveBeenCalledTimes(1);
	});

	it('should trigger an output when duplicates are found and the counts are higher then the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 2 }]);
		const scanner = new Scanner({}, interval);

		await scanner.scan();

		expect(Output.prototype.output).toHaveBeenCalledTimes(1);
	});

	// it('should ask if you want to scan the same directory again', async () => {
	// 	statSyncMock.mockReturnValue({ isFile: () => false, isDirectory: () => true });
	// 	ConfirmDuplicatePathQuestionMock.mockResolvedValue(false);
	// 	DirectoryGetFilesMock.mockReturnValue([]);
	// 	const scanner = new Scanner({}, interval);

	// 	await scanner.scan();
	// 	await scanner.scan();

	// 	expect(ConfirmDuplicatePathQuestionMock).toHaveBeenCalledTimes(1);
	// 	expect(DirectoryGetFilesMock).toHaveBeenCalledTimes(1);
	// });

	// it('should ask if you want to scan the same file again', async () => {
	// 	statSyncMock.mockReturnValue({ isFile: () => true, isDirectory: () => false });
	// 	ConfirmDuplicatePathQuestionMock.mockResolvedValue(false);
	// 	FileProcessContentMock.mockReturnValue(noStringsFile);
	// 	const scanner = new Scanner({}, interval);

	// 	await scanner.scan();
	// 	await scanner.scan();

	// 	expect(ConfirmDuplicatePathQuestionMock).toHaveBeenCalledTimes(1);
	// 	expect(FileProcessContentMock).toHaveBeenCalledTimes(1);
	// });

	// it('should re-scan directory when confirmed', async () => {
	// 	ConfirmDuplicatePathQuestionMock.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
	// 	const scanner = new Scanner({}, interval);

	// 	await scanner.scan();
	// 	await scanner.scan();

	// 	expect(File.prototype.processContent).toHaveBeenCalledTimes(2);
	// });

	// it('should ask if you want to scan another directory', async () => {
	// 	ConfirmPathQuestionMock.mockResolvedValueOnce(false);
	// 	const scanner = new Scanner({}, interval);

	// 	await scanner.scan();

	// 	expect(ConfirmPathQuestionMock).toHaveBeenCalledTimes(1);
	// });

	// it('should re-ask if you want to scan another directory', async () => {
	// 	ConfirmPathQuestionMock.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
	// 	const scanner = new Scanner({}, interval);

	// 	await scanner.scan();

	// 	expect(ConfirmPathQuestionMock).toHaveBeenCalledTimes(2);
	// });

	it('should throw when the path does not point to a directory or file', () => {
		existsSyncMock.mockReturnValue(false);
		expect(async () => await new Scanner({ path: 'dummy-directory' }, interval).scan()).rejects.toThrow(
			'Invalid path: No such directory or file.',
		);
	});

	it('should normalize the path', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue('/Users/Dummy-User/development/current-working-directory');
		resolveMock.mockReturnValue('/Users/Dummy-User/development/dummy-directory/');
		normalizeMock.mockReturnValue('/Users/Dummy-User/development/dummy-directory/');

		await new Scanner({ path: '../dummy-directory' }, interval).scan();

		expect(resolveMock).toBeCalledWith('/Users/Dummy-User/development/current-working-directory', '../dummy-directory');
		expect(normalizeMock).toBeCalledWith('/Users/Dummy-User/development/dummy-directory/');
	});

	it('should not show a loader when the scan is faster then the given interval', async () => {
		statSyncMock.mockReturnValue({ isFile: () => true, isDirectory: () => false });
		DirectoryGetFilesMock.mockReturnValue([{}]);
		FileProcessContentMock.mockImplementation(() => {
			return new Promise((resolve) => {
				setTimeout(() => resolve(true), 1);
				jest.runAllTimersAsync();
			});
		});

		const scanner = new Scanner({ path: '../dummy-file' }, 10);

		expect(process.stdout.clearLine).not.toHaveBeenCalled();
		expect(process.stdout.cursorTo).not.toHaveBeenCalled();
		expect(process.stdout.write).not.toHaveBeenCalled();

		await scanner.scan();

		expect(process.stdout.clearLine).toHaveBeenCalledTimes(1);
		expect(process.stdout.cursorTo).toHaveBeenCalledTimes(1);
		expect(process.stdout.write).not.toHaveBeenCalled();
	});

	it('should show a loader when the scan takes longer then the given interval', async () => {
		statSyncMock.mockReturnValue({ isFile: () => true, isDirectory: () => false });
		DirectoryGetFilesMock.mockReturnValue([{}]);
		FileProcessContentMock.mockImplementation(() => {
			return new Promise((resolve) => {
				setTimeout(() => resolve(true), 400);
				jest.runAllTimersAsync();
			});
		});

		const scanner = new Scanner({ path: '../dummy-file' }, 10);

		expect(process.stdout.clearLine).not.toHaveBeenCalled();
		expect(process.stdout.cursorTo).not.toHaveBeenCalled();
		expect(process.stdout.write).not.toHaveBeenCalled();

		await scanner.scan();

		expect(process.stdout.clearLine).toHaveBeenCalledTimes(4);
		expect(process.stdout.cursorTo).toHaveBeenCalledTimes(4);
		expect(process.stdout.write).toHaveBeenCalledTimes(37);
	});
});
