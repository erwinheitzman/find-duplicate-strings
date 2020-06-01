import { Question } from './question';

export class ConfirmDirectoryQuestion extends Question {
	public constructor() {
		super('confirm-recursive-directory', 'Would you like to scan another directory?', 'confirm');
	}

	public async getAnswer(): Promise<boolean> {
		return super.getAnswer();
	}
}
