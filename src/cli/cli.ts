import { Command } from 'commander';

import { Scanner } from '../scanner/scanner.js';

interface Options {
	silent?: boolean;
	exclusions?: string;
	extensions?: string;
	threshold?: string;
}

const program = new Command();

program
	.option('--exclusions [EXCLUSIONS]', 'comma separated list of directories and/or files to exclude (optional)')
	.option('--extensions [EXTENSIONS]', 'comma separated list of extensions to scan (optional)')
	.option('--threshold [THRESHOLD]', 'results lower or equal to the threshold will be ignored', '1')
	.option('--output [FILENAME]', 'filename for the output file', 'fds-output')
	.option('--interactive', 'starts the program in interactive mode')
	.argument('glob pattern', 'glob pattern for directories/files to scan')
	.action(main)
	.parse();

async function main(path: string, options: Options) {
	await new Scanner({ ...options, path }).scan().catch((e) => console.error(e));
}
