import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { Finding } from '../typings/finding';

export class Output {
	private data: Finding[];
	private path: string;

	public constructor(
		input: Finding[],
		private outputFileName: string = 'fds-output',
	) {
		this.data = input.sort((a, b) => b.count - a.count);
		this.path = resolve(process.cwd(), `${this.outputFileName}.json`);
	}

	public output(): void {
		let count = 0;
		const createFileName = (path: string) => {
			if (existsSync(path)) {
				return createFileName(resolve(process.cwd(), `${this.outputFileName}-${++count}.json`));
			}
			return path;
		};

		this.outputToFile(this.data, createFileName(this.path));
	}

	private outputToFile(output: Finding[], filePath: string): void {
		const data = JSON.stringify(output, null, 2);
		writeFileSync(filePath, data, { encoding: 'utf-8' });
	}
}
