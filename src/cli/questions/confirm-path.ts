import { Question } from './question';

export class ConfirmPathQuestion extends Question {
	public constructor() {
		super('confirm-path', 'Would you like to scan another path?', 'confirm');
	}

	public async getAnswer(): Promise<boolean> {
		return super.getAnswer();
	}
}
