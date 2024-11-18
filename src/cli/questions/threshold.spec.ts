import { expect, jest, describe, it } from '@jest/globals';

jest.unstable_mockModule('@inquirer/prompts', () => ({
	input: jest.fn(),
}));

const { input } = await import('@inquirer/prompts');

const { ThresholdQuestion } = await import('./threshold.js');

describe('ThresholdQuestion', () => {
	it('should return the answer when it is found', async () => {
		jest.mocked(input).mockResolvedValue('5');

		const question = new ThresholdQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('5');
	});
});
