import { prompt } from 'inquirer';
import { QuestionMock } from './question.mocks';

jest.mock('inquirer');

const promptMock = prompt as unknown as jest.Mock;

describe('Question', () => {
	it('should have default type "input"', () => {
		const question = new QuestionMock('foo', 'bar');
		expect(question['type']).toEqual('input');
	});

	it('should take the name and message parameters', () => {
		const question = new QuestionMock('foo', 'bar');

		expect(question['name']).toEqual('foo');
		expect(question['message']).toEqual('bar');
	});

	it('should be possible to overwrite the type', () => {
		const question = new QuestionMock('foo', 'bar', 'password');

		expect(question['type']).toEqual('password');
	});

	it('should set the defaultAnswer', () => {
		const question = new QuestionMock('foo', 'bar', 'password', 'foobar');

		expect(question['defaultAnswer']).toEqual('foobar');
	});

	it('should return the answer when it exists', async () => {
		const answerData = { cookies: 'yes' };
		promptMock.mockResolvedValue(answerData);
		const question = new QuestionMock('cookies', 'do you want cookies?');
		const answer = await question.getAnswer();
		expect(answer).toEqual('yes');
	});

	it('should return undefined when it does not exist', async () => {
		const answerData = {};
		promptMock.mockResolvedValue(answerData);
		const question = new QuestionMock('cookies', 'do you want cookies?');
		const answer = await question.getAnswer();
		expect(answer).toEqual(undefined);
	});
});
