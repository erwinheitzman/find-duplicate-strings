import { input } from '@inquirer/prompts';

export class ExclusionsQuestion {
	public async getAnswer(): Promise<string> {
		return input({
			message: 'Please provide any directories or files that you would like to exclude (comma separated list)',
		});
	}
}
