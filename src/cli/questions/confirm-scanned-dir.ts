import { Question } from './question';

export class ConfirmScannedDirQuestion extends Question {
	public constructor() {
		super(
			'confirm-recursive-directory',
			'This directory has already been scanned. Are you sure you want to scan this directory?',
			'confirm',
		);
	}

	public async getAnswer(): Promise<boolean> {
		return super.getAnswer();
	}
}
