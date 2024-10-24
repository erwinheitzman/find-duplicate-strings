import { input } from '@inquirer/prompts';
import { ThresholdQuestion } from './threshold';

jest.mock('@inquirer/prompts');

describe('ThresholdQuestion', () => {
	it('should return the answer when it is found', async () => {
		jest.mocked(input).mockResolvedValue('5');

		const question = new ThresholdQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('5');
	});
});
