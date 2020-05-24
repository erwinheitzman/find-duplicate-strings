import { Command } from 'commander';
import { createPromptModule, Answers } from 'inquirer';
import { Scanner, Findings, Finding } from '../scan';
import { resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';

const scanner = new Scanner();
const program = new Command();
const prompt = createPromptModule();

const QUESTIONS = {
	SCAN: {
		name: 'scanPath',
		message: 'Please provide a directory to scan for duplicate values.',
		type: 'input',
	},
	FORMATS: {
		name: 'formats',
		message: 'Please provide the file extensions you want to scan or leave empty to scan all files',
		choices: ['js', 'ts', 'json'],
		type: 'checkbox',
	},
	WRITE: {
		name: 'writePath',
		message: 'Please provide a filepath to store the values.',
		type: 'input',
	},
};

export const outputFindings = (findings: Findings): void => {
	if (!Object.keys(findings).length) {
		console.log('No duplicates where found.');
		return;
	}

	prompt([QUESTIONS.WRITE]).then(({ writePath }: Answers) => {
		console.log(findings);

		const filePath = resolve(process.cwd(), writePath);
		const data = JSON.stringify(findings, null, 2);
		writeFileSync(`${filePath}.json`, data, { encoding: 'utf8' });
	});
};

export const filterFileFormats = ({ scanPath }: Answers): Promise<Answers> => {
	return prompt([QUESTIONS.FORMATS]).then(({ formats }) => ({ formats, scanPath }));
};

export const scanDirAndLogFindings = ({ formats, scanPath }: Answers): Findings => {
	const resolvedPath = resolve(process.cwd(), scanPath);

	if (!existsSync(resolvedPath)) {
		throw new Error('Directory does not exist, please pass a valid path.');
	}

	const findings = scanner.scanDir(resolvedPath, formats);

	if (Object.keys(findings).length) {
		console.table(findings);
	}

	return findings;
};

export function run(): void {
	prompt([QUESTIONS.SCAN])
		.then(filterFileFormats)
		.then(scanDirAndLogFindings)
		.then(outputFindings)
		.catch((e: Error) => {
			console.error(e);
		});
}

program.option('-r, run', 'run squisher', run);

program.parse(process.argv);
