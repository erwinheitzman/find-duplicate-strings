/* eslint @typescript-eslint/no-explicit-any: 0 */

import { OutputQuestion } from './output';
import { prompt } from 'inquirer';

jest.mock('inquirer');

let promptMock: jest.Mock<any, any>;

describe('File', () => {
	beforeEach(() => {
		// @ts-ignore
		promptMock = prompt as jest.Mock<any, any>;
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should return the answer when it is found', async () => {
		// arrange
		promptMock.mockResolvedValue({ output: 'dummy' });
		const question = new OutputQuestion();

		// act
		const answer = await question.getAnswer();

		// assert
		expect(answer).toEqual('dummy');
	});

	it('should throw when the answer is not found', async () => {
		// arrange
		promptMock.mockResolvedValue({ nope: 'dummy' });
		const question = new OutputQuestion();

		// act
		const answer = async () => await question.getAnswer();

		// act & assert
		expect(answer).rejects.toThrowError('Answer not found');
	});
});
