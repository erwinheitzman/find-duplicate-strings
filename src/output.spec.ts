import { Output } from './output';
import { writeFileSync } from 'node:fs';
import { input } from '@inquirer/prompts';
import { findings } from './output.mocks';
import { OutputQuestion } from './cli/questions';

jest.mock('node:fs');
jest.mock('node:path');
jest.mock('@inquirer/prompts');
jest.mock('./cli/questions/output');

const OutputQuestionMock = OutputQuestion.prototype.getAnswer as jest.Mock;

describe('Output', () => {
	beforeEach(() => {
		(input as unknown as jest.Mock)
			.mockResolvedValueOnce({
				output: 'dummy1',
			})
			.mockResolvedValueOnce({
				output: 'dummy2',
			});
		OutputQuestionMock.mockResolvedValue('file');
	});

	// it('should output to the console when the "silent" flag is not set', async () => {
	// 	const output = new Output(findings);

	// 	await output.output();

	// 	expect(console.table).toBeCalledWith([
	// 		['foo', 2],
	// 		['foo', 1],
	// 	]);
	// });

	// it("should add indicators that there are more results then shown when there's more then 10 findings", async () => {
	// 	const output = new Output(manyFindings);

	// 	await output.output();

	// 	expect(console.table).toBeCalledWith([
	// 		['foo', 15],
	// 		['foo', 14],
	// 		['foo', 13],
	// 		['foo', 12],
	// 		['foo', 11],
	// 		['foo', 10],
	// 		['foo', 9],
	// 		['foo', 8],
	// 		['foo', 7],
	// 		['foo', 6],
	// 		['...'],
	// 	]);
	// });

	// it('should trim the matches in the console output when they contain more then 32 characters', async () => {
	// 	findings[0].key = 'some very very very very very long name';
	// 	const output = new Output(findings);

	// 	await output.output();

	// 	expect(console.table).toBeCalledWith([
	// 		['some very very very very very lo...', 2],
	// 		['foo', 1],
	// 	]);
	// });

	it('should write with the expected content', async () => {
		findings[1].key = 'some very very very very very long name';
		const output = new Output(findings);
		const expectedOutput = JSON.stringify(findings, null, 2);

		await output.output();

		expect((writeFileSync as jest.Mock).mock.calls[0][1]).toEqual(expectedOutput);
	});

	// it('should not output to the console when the "silent" flag is set', async () => {
	// 	const output = new Output(findings, 'foo', true);

	// 	await output.output();

	// 	expect(console.table).not.toBeCalled();
	// });

	it('should always output to a file', async () => {
		const output = new Output(findings);
		const outputSilent = new Output(findings, 'foo', true);

		await output.output();
		await outputSilent.output();

		expect(writeFileSync).toHaveBeenCalledTimes(2);
	});
});
