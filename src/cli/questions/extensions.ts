import { Question } from './question';

export class ExtensionsQuestion extends Question {
	public constructor() {
		super(
			'extensions',
			'Please provide the file extensions you want to scan or leave empty to scan all files (comma separated list)',
		);
	}

	public async getAnswer(): Promise<string> {
		return super.getAnswer();
	}
}
