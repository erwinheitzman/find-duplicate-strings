import { ExtensionsQuestion } from './extensions';
import { prompt } from 'inquirer';

jest.mock('inquirer');

const promptMock = prompt as unknown as jest.Mock;

describe('ExtensionsQuestion', () => {
	it('should return the answer when it is found', async () => {
		promptMock.mockResolvedValue({ extensions: 'dummy' });
		const question = new ExtensionsQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
