import { ThresholdQuestion } from './threshold';
import { Question } from './question';

jest.mock('./question');

const questionMock = Question as jest.Mock;

describe('ThresholdQuestion', () => {
	beforeEach(() => {
		questionMock.prototype.getAnswer = jest.fn().mockResolvedValue('5');
	});

	it('should return the answer when it is found', async () => {
		const question = new ThresholdQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('5');
	});
});
