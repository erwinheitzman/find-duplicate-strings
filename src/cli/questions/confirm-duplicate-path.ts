import { Question } from './question';

export class ConfirmDuplicatePathQuestion extends Question {
	public constructor() {
		super(
			'confirm-duplicate-path',
			'This path has already been scanned. Are you sure you want to scan it again?',
			'confirm'
		);
	}

	public async getAnswer(): Promise<boolean> {
		return super.getAnswer();
	}
}
