import { ConfirmDirectoryQuestion } from './confirm-directory';
import { prompt } from 'inquirer';

jest.mock('inquirer');

const promptMock = prompt as unknown as jest.Mock;

describe('ConfirmDirectoryQuestion', () => {
	it('should return the answer when it is found', async () => {
		promptMock.mockResolvedValue({ 'confirm-recursive-directory': 'dummy' });
		const question = new ConfirmDirectoryQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
