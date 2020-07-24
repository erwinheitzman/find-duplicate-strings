import { Command } from 'commander';
import { Scanner } from '../scanner';

const program = new Command();

program
	.option('-s, --silent', 'Prevent the CLI from printing messages through the console.')
	.action(async ({ silent }: { silent: boolean }) =>
		(await new Scanner(silent).init()).scan().catch((err) => console.error(`Error: ${err.message}`)),
	)
	.parse(process.argv);
