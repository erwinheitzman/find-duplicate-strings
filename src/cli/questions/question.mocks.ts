import { Question } from './question';
import { QuestionMap } from 'inquirer';

export class QuestionMock extends Question {
	constructor(name: string, message: string, type: keyof QuestionMap = 'input', defaultAnswer?: string) {
		super(name, message, type, defaultAnswer);
	}
}
