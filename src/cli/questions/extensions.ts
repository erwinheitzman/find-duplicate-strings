import { input } from '@inquirer/prompts';

export class ExtensionsQuestion {
	public async getAnswer(): Promise<string> {
		return input({
			message:
				'Please provide the file extensions you want to scan or leave empty to scan all files (comma separated list)',
		});
	}
}
