import { Question } from './question';

export class OutputQuestion extends Question {
	public constructor() {
		super('output', 'Please provide a filepath to store the output.');
	}

	public async getAnswer(): Promise<string> {
		return super.getAnswer();
	}
}
