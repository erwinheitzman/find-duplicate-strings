import { input } from '@inquirer/prompts';

export class ThresholdQuestion {
	public getAnswer(): Promise<string> {
		return input({
			message: 'Please provide a threshold (only results that apear more often then the threshold will be output)',
			default: '1',
		});
	}
}
