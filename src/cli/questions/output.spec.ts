import { OutputQuestion } from './output';
import { prompt } from 'inquirer';

jest.mock('inquirer');

const promptMock = (prompt as unknown) as jest.Mock<any, any>;

describe('OutputQuestion', () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should return the answer when it is found', async () => {
		promptMock.mockResolvedValue({ output: 'dummy' });
		const question = new OutputQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
