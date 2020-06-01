import { Question } from './question';

export class ExtensionsQuestion extends Question {
	public constructor() {
		super(
			'extensions',
			'Please provide the file extensions you want to scan or leave empty to scan all files (separated list by ;)',
		);
	}

	public async getAnswer(): Promise<string[]> {
		return (await super.getAnswer())
			.split(';')
			.map((extension: string) => {
				if (extension.startsWith('.')) {
					return extension.substr(1, extension.length);
				}
				return extension;
			})
			.filter((extension: string) => extension);
	}
}
