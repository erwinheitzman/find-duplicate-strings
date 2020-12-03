import { ExclusionsQuestion } from './exclusions';
import { prompt } from 'inquirer';

jest.mock('inquirer');

const promptMock = (prompt as unknown) as jest.Mock<any, any>;

describe('ExclusionsQuestion', () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should return the answer when it is found', async () => {
		promptMock.mockResolvedValue({ exclusions: 'dummy' });
		const question = new ExclusionsQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
