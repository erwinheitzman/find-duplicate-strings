import { confirm } from '@inquirer/prompts';

export class ConfirmPathQuestion {
	public async getAnswer(): Promise<boolean> {
		return confirm({ message: 'Would you like to scan another path?' });
	}
}
