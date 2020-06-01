import { Question } from './question';

export class ExclusionsQuestion extends Question {
	public constructor() {
		super('exclusions', 'Please provide any directories that you want to skip (separated list by ;)');
	}

	public async getAnswer(): Promise<string[]> {
		const answer = await super.getAnswer();
		return answer.split(';');
	}
}
