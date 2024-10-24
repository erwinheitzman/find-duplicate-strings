import { Command } from 'commander';
import { Scanner } from '../scanner';

interface Options {
	silent?: boolean;
	exclusions?: string;
	extensions?: string;
	threshold?: string;
}

const program = new Command();

program
	.option('--exclusions <items>', 'comma separated list of directories and/or files to exclude')
	.option('--extensions <items>', 'comma separated list of extensions to scan')
	.option('-t, --threshold <int>', 'defaults to 1 (when 5, results lower or equal to 5 will be ignored)')
	.option('-s, --silent', 'prevent CLI from printing messages through the console')
	.argument('path', 'path to scan')
	.action(main)
	.parse();

async function main(path: string, options: Options) {
	await new Scanner({ ...options, path }).scan().catch((e) => console.error(e));
}
