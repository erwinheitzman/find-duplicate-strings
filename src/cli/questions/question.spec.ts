/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Question } from './question';
import { prompt } from 'inquirer';

jest.mock('inquirer');

let promptMock: jest.Mock<any, any>;

describe('File', () => {
	beforeEach(() => {
		// @ts-expect-error
		promptMock = prompt as jest.Mock<any, any>;
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should have default type "input"', () => {
		// arrange & act
		// @ts-expect-error
		const question = new Question('foo', 'bar');

		expect(question['type']).toEqual('input');
	});

	it('should take the name and message parameters', () => {
		// arrange & act
		// @ts-expect-error
		const question = new Question('foo', 'bar');

		expect(question['name']).toEqual('foo');
		expect(question['message']).toEqual('bar');
	});

	it('should be possible to overwrite the type', () => {
		// arrange & act
		// @ts-expect-error
		const question = new Question('foo', 'bar', 'baz');

		// assert
		expect(question['type']).toEqual('baz');
	});

	it('should throw when the answer is not found', async () => {
		// arrange
		promptMock.mockResolvedValue({ nope: 'dummy' });
		// @ts-expect-error
		const question = new Question();

		// act
		const answer = async () => await question.getAnswer();

		// arrange & act
		expect(answer).rejects.toThrowError('Answer not found');
	});
});
