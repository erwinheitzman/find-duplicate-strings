import { confirm } from '@inquirer/prompts';

import { ConfirmDuplicatePathQuestion } from './confirm-duplicate-path';

jest.mock('@inquirer/prompts');

describe('ConfirmDuplicatePathQuestion', () => {
	it('should return the answer when it is found', async () => {
		jest.mocked(confirm).mockResolvedValue(true);

		const question = new ConfirmDuplicatePathQuestion();

		const answer = await question.getAnswer();

		expect(answer).toEqual(true);
	});
});
