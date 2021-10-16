import { ThresholdQuestion } from './threshold';
import { prompt } from 'inquirer';

jest.mock('inquirer');

const promptMock = prompt as unknown as jest.Mock;

describe('ThresholdQuestion', () => {
	it('should return the answer when it is found', async () => {
		promptMock.mockResolvedValue({ threshold: '5' });
		const question = new ThresholdQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('5');
	});
});
