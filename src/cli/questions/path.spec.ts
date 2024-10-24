import { input } from '@inquirer/prompts';
import { PathQuestion } from './path';

jest.mock('@inquirer/prompts');

describe('PathQuestion', () => {
	it('should return the answer when it is found', async () => {
		jest.mocked(input).mockResolvedValue('dummy');

		const question = new PathQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
