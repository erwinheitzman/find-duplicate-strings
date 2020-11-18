import { Command } from 'commander';
import { Scanner } from '../scanner';
import { Store } from '../store';

const program = new Command();

interface Options {
	silent?: boolean;
	exclusions?: string;
	extensions?: string;
	threshold?: string;
	args: string[];
}

const killProcess = () => {
	if (!program.killed) {
		Store.clear();
		process.exit();
	}
};

process.on('SIGINT', () => killProcess());
process.on('exit', () => killProcess());
process.on('uncaughtException', () => killProcess());

try {
	Store.create();
	program
		.exitOverride()
		.option('--exclusions <items>', 'comma separated list of directories and/or files to exclude')
		.option('--extensions <items>', 'comma separated list of extensions to scan')
		.option('-t, --threshold <int>', 'defaults to 1 (when 5, results lower or equal to 5 will be ignored)')
		.option('-s, --silent', 'prevent CLI from printing messages through the console')
		.action(init)
		.parse(process.argv);
} catch (err) {
	killProcess();
}

async function init({ silent, exclusions, extensions, threshold, args }: Options) {
	await new Scanner({ silent, exclusions, extensions, threshold, path: args[0] }).scan().catch((err) => {
		console.error(`Error: ${err.message}`);
	});
}
