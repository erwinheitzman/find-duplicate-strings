import { Question } from './question';

export class ThresholdQuestion extends Question {
	public constructor() {
		super(
			'threshold',
			'Please provide a threshold (only results that apear more often then the threshold will be output)',
			'input',
			'1'
		);
	}

	public async getAnswer(): Promise<string> {
		return super.getAnswer();
	}
}
