import { ExtensionsQuestion } from './extensions';
import { Question } from './question';

jest.mock('./question');

const questionMock = Question as jest.Mock;

describe('ExtensionsQuestion', () => {
	beforeEach(() => {
		questionMock.prototype.getAnswer = jest.fn().mockResolvedValue('dummy');
	});

	it('should return the answer when it is found', async () => {
		const question = new ExtensionsQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual('dummy');
	});
});
