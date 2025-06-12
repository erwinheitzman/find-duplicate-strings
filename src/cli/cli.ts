import { Command } from "commander";

import { Scanner } from "../scanner/scanner.js";

interface Options {
	interactive?: boolean;
	ignore?: string;
	threshold?: string;
}

const program = new Command();

program
	.option(
		"--ignore [IGNORE]",
		"comma separated list of glob patterns for directories/files to ignore (optional)",
	)
	.option(
		"--threshold [THRESHOLD]",
		"results lower or equal to the threshold will be ignored",
		"1",
	)
	.option("--output [FILENAME]", "filename for the output file", "fds-output")
	.option("--interactive", "starts the program in interactive mode")
	.argument("glob pattern", "glob pattern for directories/files to scan")
	.action(main)
	.parse();

async function main(path: string, options: Options) {
	await new Scanner({ ...options, path }).scan().catch((e) => console.error(e));
}
