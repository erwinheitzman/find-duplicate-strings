import { input } from '@inquirer/prompts';

import { ExtensionsQuestion } from './extensions.js';

jest.mock('@inquirer/prompts');

describe('ExtensionsQuestion', () => {
	it('should return the answer when it is found', async () => {
		jest.mocked(input).mockResolvedValue('dummy');

		const question = new ExtensionsQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
