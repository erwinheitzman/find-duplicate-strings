import { OutputQuestion } from './output';
import { Question } from './question';

jest.mock('./question');

const questionMock = Question as jest.Mock;

describe('OutputQuestion', () => {
	beforeEach(() => {
		questionMock.prototype.getAnswer = jest.fn().mockResolvedValue('dummy');
	});

	it('should return the answer when it is found', async () => {
		const question = new OutputQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
