import { ConfirmPathQuestion } from './confirm-path';
import { Question } from './question';

jest.mock('./question');

const questionMock = Question as jest.Mock;

describe('ConfirmPathQuestion', () => {
	beforeEach(() => {
		questionMock.prototype.getAnswer = jest.fn().mockResolvedValue('dummy');
	});

	it('should return the answer when it is found', async () => {
		const question = new ConfirmPathQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
