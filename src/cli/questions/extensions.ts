import { Question } from './question';
import { Extensions } from '../../extensions';

const { removeDotPrefix } = new Extensions();

export class ExtensionsQuestion extends Question {
	public constructor() {
		super(
			'extensions',
			'Please provide the file extensions you want to scan or leave empty to scan all files (comma separated list)',
		);
	}

	public async getAnswer(): Promise<string[]> {
		const answer: string = await super.getAnswer();
		return removeDotPrefix(answer.split(','));
	}
}
