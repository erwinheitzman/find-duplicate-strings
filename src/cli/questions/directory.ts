import { Question } from './question';

export class DirectoryQuestion extends Question {
	public constructor() {
		super('directory', 'Please provide a directory to scan for duplicate values.');
	}

	public async getAnswer(): Promise<string> {
		return super.getAnswer();
	}
}
