import { DirectoryQuestion } from './directory';
import { prompt } from 'inquirer';

jest.mock('inquirer');

const promptMock = (prompt as unknown) as jest.Mock<any, any>;

describe('DirectoryQuestion', () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should return the answer when it is found', async () => {
		promptMock.mockResolvedValue({ directory: 'dummy' });
		const question = new DirectoryQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
