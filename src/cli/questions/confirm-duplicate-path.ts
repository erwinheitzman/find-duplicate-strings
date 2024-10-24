import { confirm } from '@inquirer/prompts';

export class ConfirmDuplicatePathQuestion {
	public async getAnswer(): Promise<boolean> {
		return confirm({ message: 'This path has already been scanned. Are you sure you want to scan it again?' });
	}
}
