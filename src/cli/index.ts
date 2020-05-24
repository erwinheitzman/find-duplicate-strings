import { Command } from 'commander';
import { createPromptModule, Answers } from 'inquirer';
import { Scanner, Findings } from '../scan';
import { resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';
import questions from './questions.json';

const scanner = new Scanner();
const program = new Command();
const prompt = createPromptModule();

export const outputFindings = (findings: Findings): void => {
	if (!Object.keys(findings).length) {
		console.log('No duplicates where found.');
		return;
	}

	prompt([questions.write]).then(({ writePath }: Answers) => {
		const filePath = resolve(process.cwd(), writePath);
		const data = JSON.stringify(findings, null, 2);
		writeFileSync(`${filePath}.json`, data, { encoding: 'utf8' });
	});
};

export const filterFileFormats = ({ scanPath }: Answers): Promise<Answers> => {
	return prompt([questions.extensions]).then(({ extensions }) => ({ extensions, scanPath }));
};

export const scanDirAndLogFindings = ({ extensions, scanPath }: Answers): Findings => {
	const resolvedPath = resolve(process.cwd(), scanPath);

	if (!existsSync(resolvedPath)) {
		throw new Error('Directory does not exist, please pass a valid path.');
	}

	const findings = scanner.scanDir(resolvedPath, extensions);

	if (Object.keys(findings).length) {
		console.table(findings, ['count']);
	}

	return findings;
};

export function run(): void {
	prompt([questions.scan])
		.then(filterFileFormats)
		.then(scanDirAndLogFindings)
		.then(outputFindings)
		.catch((e: Error) => {
			console.error(e);
		});
}

program.option('-r, run', 'run squisher', run);

program.parse(process.argv);
