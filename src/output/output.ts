import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { Finding } from "../typings/finding.js";

export class Output {
	private data: Finding[];
	private path: string;
	private count = 0;

	public constructor(
		input: Finding[],
		private outputFileName = "fds-output",
	) {
		this.data = input.sort((a, b) => b.count - a.count);
		this.path = resolve(process.cwd(), `${this.outputFileName}.json`);
	}

	public output(): void {
		const createFileName = (path: string) => {
			if (existsSync(path)) {
				return createFileName(
					resolve(process.cwd(), `${this.outputFileName}-${++this.count}.json`),
				);
			}
			return path;
		};

		this.outputToFile(this.data, createFileName(this.path));
	}

	private outputToFile(output: Finding[], filePath: string): void {
		try {
			const data = JSON.stringify(output, null, 2);
			writeFileSync(filePath, data, { encoding: "utf-8" });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			// file is too big and needs to be split into multiple files
			const shard = `${output.length}`.length;
			const chunkSize = Math.ceil(output.length / shard);
			for (let i = 0; i < shard; i++) {
				writeFileSync(
					filePath.replace(".json", `[${i}].json`),
					JSON.stringify(output.splice(0, chunkSize), null, 2),
					{
						encoding: "utf-8",
					},
				);
			}
		}
	}
}
