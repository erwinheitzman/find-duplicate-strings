import { resolve } from 'node:path';
import { writeFileSync, existsSync } from 'node:fs';
import { Finding } from './finding';
import { OutputQuestion } from './cli/questions';

export class Output {
	private data: Finding[];

	public constructor(
		input: Finding[],
		private outputFileName: string = 'fds-output',
		private interactive: boolean = false,
	) {
		this.data = input.sort((a, b) => b.count - a.count);
	}

	public async output(): Promise<void> {
		let filename: string;
		if (this.interactive) {
			filename = await new OutputQuestion().getAnswer();
		} else {
			let count = 0;
			const createFileName = (path: string) => {
				if (existsSync(path)) {
					return createFileName(resolve(process.cwd(), `${this.outputFileName}-${++count}.json`));
				}
				return path;
			};

			filename = createFileName(resolve(process.cwd(), `${this.outputFileName}.json`));
		}

		this.outputToFile(this.data, filename);
	}

	private outputToFile(output: Finding[], filePath: string): void {
		const data = JSON.stringify(output, null, 2);
		writeFileSync(filePath, data, { encoding: 'utf8' });
	}
}
