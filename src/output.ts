import { resolve } from 'path';
import { writeFileSync } from 'fs';
import { OutputQuestion } from './cli/questions';
import { Finding } from './finding';

export class Output {
	private data: Finding[];

	public constructor(input: Finding[], private silent: boolean) {
		this.data = input.sort((a, b) => b.count - a.count);
	}

	public async output(): Promise<void> {
		if (!this.silent) {
			this.outputToConsole(this.data);
		}

		const fileName = await new OutputQuestion().getAnswer();

		this.outputToFile(this.data, fileName);
	}

	private outputToConsole(output: Finding[]): void {
		const outputCopy = JSON.parse(JSON.stringify(output.slice(0, 10))) as Finding[];

		const consoleOutput: [string, number?][] = outputCopy.map(this.processFinding);

		if (output.length > 10) {
			consoleOutput.push(['...']);
		}

		console.table(consoleOutput);
	}

	private outputToFile(output: Finding[], filename: string): void {
		const filePath = resolve(process.cwd(), filename);
		const data = JSON.stringify(output, null, 2);
		writeFileSync(`${filePath}.json`, data, { encoding: 'utf8' });
	}

	private processFinding(finding: Finding): [string, number] {
		if (finding.key.length > 32) {
			finding.key = finding.key.substring(0, 32) + '...';
		}
		return [finding.key, finding.count];
	}
}
