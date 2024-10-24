import { input } from '@inquirer/prompts';

export class OutputQuestion {
	public async getAnswer(): Promise<string> {
		return input({ message: 'Please provide a filepath to store the output.' });
	}
}
