import { ConfirmDuplicatePathQuestion } from './confirm-duplicate-path';
import { Question } from './question';

jest.mock('./question');

const questionMock = Question as jest.Mock;

describe('ConfirmDuplicatePathQuestion', () => {
	beforeEach(() => {
		questionMock.prototype.getAnswer = jest.fn().mockResolvedValue('dummy');
	});

	it('should return the answer when it is found', async () => {
		const question = new ConfirmDuplicatePathQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
