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
jest.mock('./output');
jest.mock('./store');
jest.mock('./file');
jest.mock('fs');

let getAll: jest.Mock<any, any>;
let getStrings: jest.Mock<any, any>;
let getFiles: jest.Mock<any, any>;
let output: jest.Mock<any, any>;
let exclusionsAnswer: jest.Mock<any, any>;
let extensionsAnswer: jest.Mock<any, any>;
let dirAnswer: jest.Mock<any, any>;
let confirmDirAnswer: jest.Mock<any, any>;
let confirmScannedDirAnswer: jest.Mock<any, any>;

describe('Scanner', () => {
	beforeEach(() => {
		getAll = Store.prototype.getAll = jest.fn().mockReturnValue([{ count: 1 }]);
		getStrings = File.prototype.getStrings = jest.fn();
		getFiles = Directory.prototype.getFiles = jest.fn().mockReturnValue([]);
		output = Output.prototype.output = jest.fn();
		exclusionsAnswer = ExclusionsQuestion.prototype.getAnswer = jest.fn().mockResolvedValue(['yes']);
		extensionsAnswer = ExtensionsQuestion.prototype.getAnswer = jest.fn().mockResolvedValue(['no']);
		dirAnswer = DirectoryQuestion.prototype.getAnswer = jest.fn().mockResolvedValue(['dummy']);
		confirmDirAnswer = ConfirmDirectoryQuestion.prototype.getAnswer = jest.fn().mockResolvedValue(false);
		confirmScannedDirAnswer = ConfirmScannedDirQuestion.prototype.getAnswer = jest.fn().mockResolvedValue(false);
		console.log = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should setup the scanner', async () => {
		// arrange
		const scanner = new Scanner(false);

		// act
		const result = await scanner.init();

		// assert
		expect((result as any).exclusions).toEqual(['yes']);
		expect((result as any).extensions).toEqual(['no']);
		expect(result instanceof Scanner).toEqual(true);
	});

	it('should create a file instance', async () => {
		// arrange
		getFiles.mockReturnValue([{}, {}, {}, {}]);
		const scanner = new Scanner(false);

		// act
		await scanner.scan();

		// assert
		expect(getStrings).toHaveBeenCalledTimes(4);
	});

	it('should log a message to the console when no duplicates are found', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 1 }]);
		const scanner = new Scanner(false);

		// act
		await scanner.scan();

		// assert
		expect(console.log).toHaveBeenCalledWith('No duplicates where found.');
	});

	it('should not log a message to the console when duplicates are found', async () => {
		// arrange
		getAll.mockReturnValue([{ count: 2 }]);
		const scanner = new Scanner(false);

		// act
		await scanner.scan();

		// assert
		expect(console.log).not.toHaveBeenCalled();
	});

	it('should create an output after running the scan', async () => {
		// arrange
		const scanner = new Scanner(false);

		// act
		await scanner.scan();

		// assert
		expect(Output.prototype.output).toBeCalled();
	});

	it('should ask if you want to scan the same directory twice', async () => {
		// arrange
		confirmScannedDirAnswer.mockResolvedValue(false);
		getFiles.mockReturnValue([]);
		const scanner = new Scanner(false);

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
		const scanner = new Scanner(false);

		// act
		await scanner.scan();
		await scanner.scan();

		// assert
		expect(getFiles).toHaveBeenCalledTimes(2);
	});

	it('should ask if you want to scan another directory', async () => {
		// arrange
		confirmDirAnswer.mockResolvedValueOnce(false);
		const scanner = new Scanner(false);

		// act
		await scanner.scan();

		// assert
		expect(confirmDirAnswer).toHaveBeenCalledTimes(1);
	});

	it('should re-ask if you want to scan another directory', async () => {
		// arrange
		confirmDirAnswer.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
		const scanner = new Scanner(false);

		// act
		await scanner.scan();

		// assert
		expect(confirmDirAnswer).toHaveBeenCalledTimes(2);
	});
});
