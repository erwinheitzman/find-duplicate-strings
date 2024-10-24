import { resolve } from 'node:path';
import { Output } from './output';
import { writeFileSync } from 'node:fs';
import { findings } from './output.mocks';

jest.mock('node:fs', () => ({
	writeFileSync: jest.fn(),
	existsSync: jest.fn().mockReturnValue(true),
}));
jest.mock('@inquirer/prompts');

const expectedOutput = JSON.stringify(
	findings.sort((a, b) => b.count - a.count),
	null,
	2,
);

describe('Output', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should write with the expected content', async () => {
		const output = new Output(findings);

		await output.output();

		expect((writeFileSync as jest.Mock).mock.calls[0][1]).toEqual(expectedOutput);
	});

	it('should update the output name if it already exists', async () => {
		const output = new Output(findings);

		await output.output();
		console.log(output['path']);

		expect(jest.mocked(writeFileSync).mock.calls[0]).toEqual([
			resolve(process.cwd(), 'fds-output.json'),
			expectedOutput,
			{ encoding: 'utf-8' },
		]);

		await output.output();
		console.log(output['path']);
		expect(jest.mocked(writeFileSync).mock.calls[1]).toEqual([
			resolve(process.cwd(), 'fds-output-1.json'),
			expectedOutput,
			{ encoding: 'utf-8' },
		]);

		await output.output();
		console.log(output['path']);
		expect(jest.mocked(writeFileSync).mock.calls[2]).toEqual([
			resolve(process.cwd(), 'fds-output-2.json'),
			expectedOutput,
			{ encoding: 'utf-8' },
		]);

		await output.output();
		console.log(output['path']);
		expect(jest.mocked(writeFileSync).mock.calls[3]).toEqual([
			resolve(process.cwd(), 'fds-output-3.json'),
			expectedOutput,
			{ encoding: 'utf-8' },
		]);

		await output.output();
		console.log(output['path']);
		expect(jest.mocked(writeFileSync).mock.calls[4]).toEqual([
			resolve(process.cwd(), 'fds-output-4.json'),
			expectedOutput,
			{ encoding: 'utf-8' },
		]);

		expect(writeFileSync).toHaveBeenCalledTimes(5);
	});
});
