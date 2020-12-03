import { QuestionMock } from './question.mocks';

jest.mock('inquirer');

describe('Question', () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

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
});
