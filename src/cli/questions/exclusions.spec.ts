import { expect, jest, describe, it } from '@jest/globals';

jest.unstable_mockModule('@inquirer/prompts', () => ({
	input: jest.fn(),
}));

const { input } = await import('@inquirer/prompts');

const { ExclusionsQuestion } = await import('./exclusions.js');

describe('ExclusionsQuestion', () => {
	it('should return the answer when it is found', async () => {
		jest.mocked(input).mockResolvedValue('dummy');

		const question = new ExclusionsQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
