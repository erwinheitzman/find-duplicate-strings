/* eslint @typescript-eslint/no-explicit-any: 0 */

import { ThresholdQuestion } from './threshold';
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
		promptMock.mockResolvedValue({ threshold: '5' });
		const question = new ThresholdQuestion();

		// act
		const answer = await question.getAnswer();

		// assert
		expect(answer).toEqual('5');
	});
});
