import { prompt, InputQuestion } from 'inquirer';

export abstract class Question {
	protected constructor(protected name: string, protected message: string) {}

	protected async getAnswer(): Promise<any> {
		const answer = await prompt(<InputQuestion>{
			name: this.name,
			message: this.message,
			type: 'input',
		});

		return answer[this.name];
	}
}
