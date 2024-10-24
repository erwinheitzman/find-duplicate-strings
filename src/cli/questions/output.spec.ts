import { input } from '@inquirer/prompts';
import { OutputQuestion } from './output';

jest.mock('@inquirer/prompts');

describe('OutputQuestion', () => {
	it('should return the answer when it is found', async () => {
		jest.mocked(input).mockResolvedValue('dummy');

		const question = new OutputQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
