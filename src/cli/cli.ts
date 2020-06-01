import { Command } from 'commander';
import { Directory } from '../directory';
import { Store } from '../store';
import { File } from '../file';
import { Finding } from '../ifinding';
import { DirectoryQuestion, ExclusionsQuestion, ExtensionsQuestion, OutputQuestion } from './questions';

const store = new Store<Finding>();
const program = new Command();

export const outputFindings = (findings: Finding[]): void => {
	if (!program.silent) {
		const consoleOutput: [string, Finding | string][] = findings
			.slice(0, 10)
			.map((finding: Finding) => [finding.key, finding]);

		consoleOutput.push(['...', '...']);
		console.table(consoleOutput);
	}
};

export const scanDir = (scanPath: string, exclusions: string[], extensions: string[]): Finding[] => {
	const directory = new Directory(scanPath, exclusions, extensions);
	const files = directory.getFiles();

	for (const file of files) {
		new File(store, file).getStrings();
	}

	const findings = store.getAll();

	const filteredFindings = findings.filter((value) => value.count > 1);

	return filteredFindings;
};

export async function run(): Promise<void> {
	try {
		const directory = await new DirectoryQuestion().getAnswer();
		const exclusions = await new ExclusionsQuestion().getAnswer();
		const extensions = await new ExtensionsQuestion().getAnswer();

		const findings = scanDir(directory, exclusions, extensions);

		if (!findings.length) {
			console.log('No duplicates where found.');
			return;
		}

		outputFindings(findings);
	} catch (error) {
		console.error(error);
	}
}

program.option('-s, --silent', 'Prevent the CLI from printing messages through the console.');

program.action(run);

program.parse(process.argv);
