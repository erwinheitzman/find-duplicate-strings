import { input } from '@inquirer/prompts';

export class PathQuestion {
	public async getAnswer(): Promise<string> {
		return input({ message: 'Please provide a path to scan for duplicate values.' });
	}
}
