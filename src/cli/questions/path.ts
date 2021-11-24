import { Question } from './question';

export class PathQuestion extends Question {
	public constructor() {
		super('path', 'Please provide a path to scan for duplicate values.');
	}

	public async getAnswer(): Promise<string> {
		return super.getAnswer();
	}
}
