import { Command } from 'commander';
import { createPromptModule } from 'inquirer';
import { Scanner } from '../scan';
import { resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { Findings } from '../findings.interface';

const scanner = new Scanner();
const program = new Command();
const prompt = createPromptModule();

const QUESTIONS = {
    SCAN: {
        name: 'scanPath',
		message: 'Please provide a directory to scan for duplicate values.',
		type: 'input'
	},
	FORMATS: {
		name: 'formats',
		message: 'Please provide the file extensions you want to scan or leave empty to scan all files',
		choices: ['js', 'ts', 'json'],
		type: 'checkbox'
	},
    WRITE: {
        name: 'writePath',
		message: 'Please provide a filepath to store the values.',
		type: 'input'
    }
};

export const outputFindings = (findings: Findings): Findings | undefined => {
	if (!Object.keys(findings).length) {
		console.log('No duplicates where found.');
		return findings;
	}

	prompt([QUESTIONS.WRITE])
		.then(({ writePath }) => {
			const filePath: string = resolve(process.cwd(), writePath as string);

			if (filePath.endsWith('.js')) {
				const data: Array<string> = [];

				Object.keys(findings).forEach((finding, i) => {
					data.push(`const string${i} = '${finding}';`);
				});

				writeFileSync(filePath, data.join('\n'), 'utf8');
				return;
			}

			if (filePath.endsWith('.json')) {
				const data: { [key: string]: string } = {};

				Object.keys(findings).forEach((finding, i) => {
					data[`string${i}`] = finding;
				});

				writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
				return;
			}

			throw new Error(`File format not supported`);
		})
		.catch((e: Error) => {
			console.error(e);
		});
};

export const filterFileFormats = (
	{ scanPath }: { scanPath: string }
): Promise<{ formats: { [x: string]: {} }; scanPath: string } | { formats: {}; scanPath: string }> => {
	return prompt([QUESTIONS.FORMATS])
		.then(({ formats }) => ({ formats, scanPath }));
};

export const scanDirAndLogFindings = (
	{ formats, scanPath }: { formats: Array<string>; scanPath: string }
): Findings => {
	const resolvedPath = resolve(process.cwd(), scanPath as string);

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
		.then(filterFileFormats as () => Promise<{
			formats: {
				[x: string]: {};
			};
			scanPath: string;
		}>)
		.then(scanDirAndLogFindings as () => Findings)
		.then(outputFindings)
		.catch((e: Error) => {
			console.error(e);
		});
}

program
    .option('-r, run', 'run squisher', run)

program.parse(process.argv);
