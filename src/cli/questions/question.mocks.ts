import { Question } from './question';
import { QuestionMap } from 'inquirer';

export class QuestionMock extends Question {
	public constructor(name: string, message: string, type?: keyof QuestionMap, defaultAnswer?: string) {
		super(name, message, type, defaultAnswer);
	}

	public async getAnswer(): Promise<string> {
		return super.getAnswer();
	}
}
