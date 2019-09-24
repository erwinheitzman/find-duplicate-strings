import { Command } from 'commander';
import { createPromptModule } from 'inquirer';
import { getFiles } from '../scan';
import { resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';

const program = new Command();
const prompt = createPromptModule();

const QUESTIONS = {
    SCAN: {
        name: 'scanPath',
        message: 'Please pass a directory to scan for duplicate values.',
    },
    WRITE: {
        name: 'writePath',
        message: 'Please pass a filepath to store the values.',
    }
};

function run(): void {
	prompt([QUESTIONS.SCAN])
		.then(({ scanPath }) => {
			const resolvedPath = resolve(process.cwd(), scanPath as string);

			if (!existsSync(resolvedPath)) {
				throw new Error('Directory does not exist, please pass a valid path.');
			}

			const findings = getFiles(resolvedPath);

			if (!Object.keys(findings).length) {
				console.log('No duplicates where found.');
				return;
			}

			console.table(findings);

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
							data[`string${i}`] = `${finding}`;
						});

						writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
						return;
					}

					throw new Error(`File format not supported`);
				})
				.catch((e) => {
					console.error(e);
				});
		}).catch((e) => {
			console.error(e);
		});
}

program
    .option('-r, run', 'run squisher', run)

program.parse(process.argv);
