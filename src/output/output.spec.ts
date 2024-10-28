import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Output } from './output';
import { findings } from './output.mocks';

jest.mock('node:fs', () => ({
	writeFileSync: jest.fn(),
	existsSync: jest.fn().mockReturnValue(false),
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

		output.output();

		expect((writeFileSync as jest.Mock).mock.calls[0][1]).toEqual(expectedOutput);
	});

	it('should update the output name if it already exists', async () => {
		const output = new Output(findings);

		output.output();
		expect(jest.mocked(writeFileSync).mock.calls[0][0]).toEqual(resolve(process.cwd(), 'fds-output.json'));

		jest.mocked(existsSync).mockReturnValueOnce(true);
		output.output();
		expect(jest.mocked(writeFileSync).mock.calls[1][0]).toEqual(resolve(process.cwd(), 'fds-output-1.json'));

		jest.mocked(existsSync).mockReturnValueOnce(true).mockReturnValueOnce(true);
		output.output();
		expect(jest.mocked(writeFileSync).mock.calls[2][0]).toEqual(resolve(process.cwd(), 'fds-output-2.json'));

		jest.mocked(existsSync).mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(true);
		output.output();
		expect(jest.mocked(writeFileSync).mock.calls[3][0]).toEqual(resolve(process.cwd(), 'fds-output-3.json'));

		expect(writeFileSync).toHaveBeenCalledTimes(4);
	});
});
