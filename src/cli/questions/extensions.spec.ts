import { expect, jest, describe, it } from '@jest/globals';

jest.unstable_mockModule('@inquirer/prompts', () => ({
	input: jest.fn(),
}));

const { input } = await import('@inquirer/prompts');

const { ExtensionsQuestion } = await import('./extensions.js');

describe('ExtensionsQuestion', () => {
	it('should return the answer when it is found', async () => {
		jest.mocked(input).mockResolvedValue('dummy');

		const question = new ExtensionsQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
