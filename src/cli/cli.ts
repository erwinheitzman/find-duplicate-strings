import { Command } from 'commander';
import { Scanner } from '../scanner';

const program = new Command();

interface Options {
	silent?: boolean;
	exclusions?: string;
	extensions?: string;
	args: string[];
}

program
	.option('--exclusions <items>', 'comma separated list of directories and/or files to exclude')
	.option('--extensions <items>', 'comma separated list of extensions to scan')
	.option('-s, --silent', 'prevent CLI from printing messages through the console')
	.action(async ({ silent, exclusions, extensions, args }: Options) => {
		await new Scanner({ silent, exclusions, extensions, path: args[0] }).scan().catch((err) => {
			console.error(`Error: ${err.message}`);
		});
	})
	.parse(process.argv);
