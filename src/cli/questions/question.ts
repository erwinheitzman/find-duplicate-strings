import { prompt, InputQuestion, QuestionMap } from 'inquirer';

export abstract class Question {
	protected constructor(
		protected name: string,
		protected message: string,
		protected type: keyof QuestionMap = 'input',
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected async getAnswer(): Promise<any> {
		const answer = await prompt(<InputQuestion>{
			name: this.name,
			message: this.message,
			type: this.type,
		});

		if (!answer[this.name]) {
			throw new Error('Answer not found');
		}

		return answer[this.name];
	}
}
