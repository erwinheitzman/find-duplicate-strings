import { input } from '@inquirer/prompts';

import { ExclusionsQuestion } from './exclusions';

jest.mock('@inquirer/prompts');

describe('ExclusionsQuestion', () => {
	it('should return the answer when it is found', async () => {
		jest.mocked(input).mockResolvedValue('dummy');

		const question = new ExclusionsQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
