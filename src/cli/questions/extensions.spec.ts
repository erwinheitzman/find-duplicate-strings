/* eslint @typescript-eslint/no-explicit-any: 0 */

import { ExtensionsQuestion } from './extensions';
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
		promptMock.mockResolvedValue({ extensions: 'dummy' });
		const question = new ExtensionsQuestion();

		// act
		const answer = await question.getAnswer();

		// assert
		expect(answer).toEqual(['dummy']);
	});

	it('should split the answer on a semicolon', async () => {
		// arrange
		promptMock.mockResolvedValue({ extensions: 'dummy1;dummy2;dummy3' });
		const question = new ExtensionsQuestion();

		// act
		const answer = await question.getAnswer();

		// assert
		expect(answer).toEqual(['dummy1', 'dummy2', 'dummy3']);
	});

	it('should remove the dot prefix from the extensions', async () => {
		// arrange
		promptMock.mockResolvedValue({ extensions: '.dummy1;dummy2;.dummy3' });
		const question = new ExtensionsQuestion();

		// act
		const answer = await question.getAnswer();

		// assert
		expect(answer).toEqual(['dummy1', 'dummy2', 'dummy3']);
	});
});
