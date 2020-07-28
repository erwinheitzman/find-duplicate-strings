/* eslint @typescript-eslint/no-explicit-any: 0 */

import { ExclusionsQuestion } from './exclusions';
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
		promptMock.mockResolvedValue({ exclusions: 'dummy' });
		const question = new ExclusionsQuestion();

		// act
		const answer = await question.getAnswer();

		// assert
		expect(answer).toEqual(['dummy']);
	});

	it('should split the answer on a comma', async () => {
		// arrange
		promptMock.mockResolvedValue({ exclusions: 'dummy1,dummy2,dummy3' });
		const question = new ExclusionsQuestion();

		// act
		const answer = await question.getAnswer();

		// assert
		expect(answer).toEqual(['dummy1', 'dummy2', 'dummy3']);
	});
});
