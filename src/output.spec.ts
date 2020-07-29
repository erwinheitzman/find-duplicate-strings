/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Output } from './output';
import { Finding } from './ifinding';
import { writeFileSync } from 'fs';
import { prompt } from 'inquirer';

jest.mock('fs');
jest.mock('inquirer');

const findings: Finding[] = [
	{
		count: 1,
		files: ['dummy/path/1'],
		key: 'foo',
	},
	{
		count: 2,
		files: ['dummy/path/2'],
		key: 'foo',
	},
];

const manyFindings: Finding[] = [...findings];

for (let i = 3; i <= 15; i++) {
	manyFindings.push({
		count: i,
		files: ['dummy/path/' + i],
		key: 'foo',
	});
}

let writeFileSyncMock: jest.Mock<any, any>;

describe('File', () => {
	beforeEach(() => {
		writeFileSyncMock = writeFileSync as jest.Mock<any, any>;
		// @ts-expect-error
		(prompt as jest.Mock<any, any>)
			.mockResolvedValueOnce({
				output: 'dummy1',
			})
			.mockResolvedValueOnce({
				output: 'dummy2',
			});
		console.table = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should output to the console when the "silent" flag is not set', async () => {
		// arrange
		const output = new Output(findings, false);

		// act
		await output.output();

		// assert
		expect(console.table).toBeCalledWith([
			['foo', 1],
			['foo', 2],
		]);
	});

	it("should add indicators that there are more results then shown when there's more then 10 findings", async () => {
		// arrange
		const output = new Output(manyFindings, false);

		// act
		await output.output();

		// assert
		expect(console.table).toBeCalledWith([
			['foo', 1],
			['foo', 2],
			['foo', 3],
			['foo', 4],
			['foo', 5],
			['foo', 6],
			['foo', 7],
			['foo', 8],
			['foo', 9],
			['foo', 10],
			['...'],
		]);
	});

	it('should trim the matches in the console output when they contain more then 32 characters', async () => {
		// arrange
		findings[1].key = 'some very very very very very long name';
		const output = new Output(findings, false);

		// act
		await output.output();

		// assert
		expect(console.table).toBeCalledWith([
			['foo', 1],
			['some very very very very very lo...', 2],
		]);
	});

	it('should trim the console output but not the file output', async () => {
		// arrange
		findings[1].key = 'some very very very very very long name';
		const output = new Output(findings, false);
		const expectedOutput = JSON.stringify(findings, null, 2);

		// act
		await output.output();

		// assert
		expect(writeFileSyncMock.mock.calls[0][1]).toEqual(expectedOutput);
	});

	it('should not output to the console when the "silent" flag is set', async () => {
		// arrange
		const output = new Output(findings, true);

		// act
		await output.output();

		// assert
		expect(console.table).not.toBeCalled();
	});

	it('should always output to a file', async () => {
		// arrange
		const output = new Output(findings, false);
		const outputSilent = new Output(findings, true);

		// act
		await output.output();
		await outputSilent.output();

		// assert
		expect(writeFileSyncMock).toBeCalledTimes(2);
	});
});
