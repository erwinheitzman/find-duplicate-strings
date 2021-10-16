import { DirectoryQuestion } from './directory';
import { prompt } from 'inquirer';

jest.mock('inquirer');

const promptMock = prompt as unknown as jest.Mock;

describe('DirectoryQuestion', () => {
	it('should return the answer when it is found', async () => {
		promptMock.mockResolvedValue({ directory: 'dummy' });
		const question = new DirectoryQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
