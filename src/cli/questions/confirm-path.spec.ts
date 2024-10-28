import { confirm } from '@inquirer/prompts';

import { ConfirmPathQuestion } from './confirm-path';

jest.mock('@inquirer/prompts');

describe('ConfirmPathQuestion', () => {
	it('should return the answer when it is found', async () => {
		jest.mocked(confirm).mockResolvedValue(true);

		const question = new ConfirmPathQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual(true);
	});
});
