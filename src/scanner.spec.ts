import { Scanner } from './scanner';
import {
	DirectoryQuestion,
	ExclusionsQuestion,
	ExtensionsQuestion,
	ConfirmDirectoryQuestion,
	ConfirmScannedDirQuestion,
	ThresholdQuestion,
} from './cli/questions';
import { Output } from './output';
import { Directory } from './directory';
import { Store } from './store';
import { File } from './file';

jest.mock('./cli/questions');
jest.mock('./directory');
jest.mock('./store');
jest.mock('./file');
jest.mock('fs');
jest.mock('path');
jest.mock('./output');
jest.mock('inquirer');

const getAllMock = Store.getAll as jest.Mock;
const processContentMock = File.prototype.processContent as jest.Mock;
const getFilesMock = Directory.prototype.getFiles as jest.Mock;
const ConfirmDirectoryQuestionMock = ConfirmDirectoryQuestion.prototype.getAnswer as jest.Mock;
const ConfirmScannedDirQuestionMock = ConfirmScannedDirQuestion.prototype.getAnswer as jest.Mock;

console.log = jest.fn();

describe('Scanner', () => {
	beforeEach(() => {
		getAllMock.mockReturnValue([{ count: 1 }]);
		getFilesMock.mockReturnValue([]);
		ConfirmDirectoryQuestionMock.mockResolvedValue(false);
		ConfirmScannedDirQuestionMock.mockResolvedValue(false);
		(ExclusionsQuestion.prototype.getAnswer as jest.Mock).mockResolvedValue('dummy-dir');
		(ExtensionsQuestion.prototype.getAnswer as jest.Mock).mockResolvedValue('.ts,.js');
		(DirectoryQuestion.prototype.getAnswer as jest.Mock).mockResolvedValue(['dummy']);
		(ThresholdQuestion.prototype.getAnswer as jest.Mock).mockResolvedValue('1');
	});

	it('should enable silent mode', async () => {
		const scanner = new Scanner({ silent: true });

		expect(scanner['silent']).toEqual(true);
	});

	it('should disable silent mode', async () => {
		const scanner = new Scanner({ silent: false });

		expect(scanner['silent']).toEqual(false);
	});

	it('should set exclusions', async () => {
		const scanner = new Scanner({ exclusions: 'one,two,three' });

		expect(scanner['exclusions']).toEqual(['one', 'two', 'three']);
	});

	it('should ask a question when exclusions are not provided', async () => {
		const scanner = new Scanner({});

		await scanner.scan();

		expect(ExclusionsQuestion.prototype.getAnswer).toBeCalledTimes(1);
	});

	it('should set extensions', async () => {
		const scanner = new Scanner({ extensions: 'one,two,three' });

		expect(scanner['extensions']).toEqual(['one', 'two', 'three']);
	});

	it('should ask a question when extensions are not provided', async () => {
		const scanner = new Scanner({});

		await scanner.scan();

		expect(ExtensionsQuestion.prototype.getAnswer).toBeCalledTimes(1);
	});

	it('should set a threshold when passing threshold as a number', async () => {
		getAllMock.mockReturnValue([{ count: 5 }]);
		const scanner = new Scanner({ threshold: 3 });

		await scanner.scan();

		expect(scanner['threshold']).toEqual(3);
		expect((Output as jest.Mock).mock.calls[0][0]).toEqual([{ count: 5 }]);
	});

	it('should set a threshold when passing threshold as a string', async () => {
		getAllMock.mockReturnValue([{ count: 5 }]);
		const scanner = new Scanner({ threshold: '3' });

		await scanner.scan();

		expect(scanner['threshold']).toEqual(3);
		expect((Output as jest.Mock).mock.calls[0][0]).toEqual([{ count: 5 }]);
	});

	it('should set a threshold when passing threshold as a float', async () => {
		getAllMock.mockReturnValue([{ count: 5 }]);
		const scanner = new Scanner({ threshold: '3.66' });

		await scanner.scan();

		expect(scanner['threshold']).toEqual(3);
		expect((Output as jest.Mock).mock.calls[0][0]).toEqual([{ count: 5 }]);
	});

	it('should ask a question when the threshold is not provided', async () => {
		const scanner = new Scanner({});

		await scanner.scan();

		expect(ThresholdQuestion.prototype.getAnswer).toBeCalledTimes(1);
	});

	it('should set path', async () => {
		const scanner = new Scanner({ path: './some/path' });

		await scanner.scan();

		expect(scanner['path']).toEqual('./some/path');
	});

	it('should not ask a question when the path is provided', async () => {
		const scanner = new Scanner({ path: './some/path' });

		await scanner.scan();

		expect(DirectoryQuestion.prototype.getAnswer).toBeCalledTimes(0);
	});

	it('should set path to an empty string when missing', async () => {
		const scanner = new Scanner({});

		await scanner.scan();

		expect(scanner['path']).toEqual('');
		expect(DirectoryQuestion.prototype.getAnswer).toBeCalledTimes(1);
	});

	it('should ask a question when the path is not provided', async () => {
		const scanner = new Scanner({});

		await scanner.scan();

		expect(DirectoryQuestion.prototype.getAnswer).toBeCalledTimes(1);
	});

	it('should create a file instance', async () => {
		getFilesMock.mockReturnValue([{}, {}, {}, {}]);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(processContentMock).toHaveBeenCalledTimes(4);
	});

	it('should log a message to the console when no results are found', async () => {
		getAllMock.mockReturnValue([]);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(console.log).toHaveBeenCalledWith('No duplicates where found.');
	});

	it('should not trigger an output when no results are found', async () => {
		getAllMock.mockReturnValue([]);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(Output.prototype.output).not.toHaveBeenCalled();
	});

	it('should log a message to the console when results are found but the counts are lower then the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 0 }]);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(console.log).toHaveBeenCalledWith('No duplicates where found.');
	});

	it('should not trigger an output when results are found but the counts are lower then the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 0 }]);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(Output.prototype.output).not.toHaveBeenCalled();
	});

	it('should log a message to the console when results are found but the counts are equal to the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 1 }]);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(console.log).toHaveBeenCalledWith('No duplicates where found.');
	});

	it('should not trigger an output when results are found but the counts are equal to the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 1 }]);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(Output.prototype.output).not.toHaveBeenCalled();
	});

	it('should not log a message to the console when duplicates are found and the counts are higher then the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 2 }]);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(console.log).not.toHaveBeenCalledTimes(1);
	});

	it('should trigger an output when duplicates are found and the counts are higher then the threshold', async () => {
		getAllMock.mockReturnValue([{ count: 2 }]);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(Output.prototype.output).toHaveBeenCalledTimes(1);
	});

	it('should ask if you want to scan the same directory twice', async () => {
		ConfirmScannedDirQuestionMock.mockResolvedValue(false);
		getFilesMock.mockReturnValue([]);
		const scanner = new Scanner({});

		await scanner.scan();
		await scanner.scan();

		expect(ConfirmScannedDirQuestionMock).toHaveBeenCalledTimes(1);
		expect(getFilesMock).toHaveBeenCalledTimes(1);
	});

	it('should re-scan directory when confirmed', async () => {
		ConfirmScannedDirQuestionMock.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
		getFilesMock.mockReturnValue([]);
		const scanner = new Scanner({});

		await scanner.scan();
		await scanner.scan();

		expect(getFilesMock).toHaveBeenCalledTimes(2);
	});

	it('should ask if you want to scan another directory', async () => {
		ConfirmDirectoryQuestionMock.mockResolvedValueOnce(false);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(ConfirmDirectoryQuestionMock).toHaveBeenCalledTimes(1);
	});

	it('should re-ask if you want to scan another directory', async () => {
		ConfirmDirectoryQuestionMock.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
		const scanner = new Scanner({});

		await scanner.scan();

		expect(ConfirmDirectoryQuestionMock).toHaveBeenCalledTimes(2);
	});
});
