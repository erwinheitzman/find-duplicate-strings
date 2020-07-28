import { Question } from './question';

export class ExclusionsQuestion extends Question {
	public constructor() {
		super(
			'exclusions',
			'Please provide any directories or files that you would like to exclude (comma separated list)',
		);
	}

	public async getAnswer(): Promise<string[]> {
		const answer: string = await super.getAnswer();
		return answer.split(',');
	}
}
