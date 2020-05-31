import { Command } from 'commander';
import { createPromptModule, Answers } from 'inquirer';
import { Directory } from '../directory';
import { Store } from '../store';
import { File } from '../file';
import { resolve } from 'path';
import { writeFileSync } from 'fs';
import { questions } from './questions';

const directory = new Directory();
const program = new Command();
const prompt = createPromptModule();

export const outputFindings = (findings: [string, unknown][]): void => {
	if (!Object.keys(findings).length) {
		console.log('No duplicates where found.');
		return;
	}

	console.table(findings, ['count']);

	prompt([questions.write]).then(({ writePath }: Answers) => {
		const filePath = resolve(process.cwd(), writePath);
		const data = JSON.stringify(findings, null, 2);
		writeFileSync(`${filePath}.json`, data, { encoding: 'utf8' });
	});
};

export const filterDirectories = ({ scanPath }: Answers): Promise<Answers> => {
	return prompt([questions.exclusions]).then(({ exclusions }) => ({ exclusions, scanPath }));
};

export const filterFileFormats = ({ exclusions, scanPath }: Answers): Promise<Answers> => {
	return prompt([questions.extensions]).then(({ extensions }) => ({ exclusions, extensions, scanPath }));
};

export const scanDirAndLogFindings = ({ exclusions, extensions, scanPath }: Answers): [string, unknown][] => {
	const files = directory.scan(scanPath, exclusions, extensions);

	for (const file of files) {
		new File(file).findAndStoreStringValues();
	}

	const findings = Store.getAll();

	const result = findings.filter(([key, value]) => {
		return (value as { count: number; files: Array<string> }).count > 1;
	});

	return result;
};

export function run(): void {
	prompt([questions.scan])
		.then(filterDirectories)
		.then(filterFileFormats)
		.then(scanDirAndLogFindings)
		.then(outputFindings)
		.catch((e: Error) => {
			console.error(e);
		});
}

program.action(run);

program.parse(process.argv);
