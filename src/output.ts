import { resolve } from 'path';
import { writeFileSync } from 'fs';
import { Finding } from './ifinding';
import { OutputQuestion } from './cli/questions';

export class Output {
	public constructor(private input: Finding[], private silent: boolean) {}

	public async output(): Promise<void> {
		if (!this.silent) {
			this.outputToConsole(this.input);
		}

		const fileName = await new OutputQuestion().getAnswer();

		this.outputToFile(this.input, fileName);
	}

	private outputToConsole(output: Finding[]) {
		const outputCopy = JSON.parse(JSON.stringify(output.slice(0, 10))) as Finding[];

		const consoleOutput = outputCopy.map(this.processFinding);

		if (output.length > 10) {
			consoleOutput.push(['...']);
		}

		console.table(consoleOutput);
	}

	private outputToFile(output: Finding[], filename: string) {
		const filePath = resolve(process.cwd(), filename);
		const data = JSON.stringify(output, null, 2);
		writeFileSync(`${filePath}.json`, data, { encoding: 'utf8' });
	}

	private processFinding(finding: Finding) {
		if (finding.key.length > 32) {
			finding.key = finding.key.substring(0, 32) + '...';
		}
		return [finding.key, finding.count];
	}
}
