import { prompt, InputQuestion, QuestionMap } from 'inquirer';

export abstract class Question {
	protected constructor(
		protected name: string,
		protected message: string,
		protected type: keyof QuestionMap = 'input',
	) {}

	protected async getAnswer(): Promise<any> {
		const answer = await prompt(<InputQuestion>{
			name: this.name,
			message: this.message,
			type: this.type,
		});

		return answer[this.name];
	}
}
