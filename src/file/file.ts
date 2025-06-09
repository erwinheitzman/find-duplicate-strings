import { createReadStream } from "node:fs";
import { type Interface, createInterface } from "node:readline";

import { store } from "../store/store.js";

export class File {
	constructor(private readonly path: string) {}

	processContent(): Promise<void> {
		return new Promise((resolve) => {
			const rl = this.readlineInterface();
			rl.on("line", (line) => this.processLine(line));
			rl.on("close", () => {
				resolve();
			});
		});
	}

	private processLine(line: string): void {
		const matches = line.match(
			/(?:("[^"\\]*(?:\\.[^"\\]*)*")|('[^'\\]*(?:\\.[^'\\]*)*'))/g,
		);

		if (matches) {
			matches.forEach((match) => {
				const isNotEmpty = match && match.length > 2;
				if (isNotEmpty) {
					this.storeMatch(match.substring(1, match.length - 1));
				}
			});
		}
	}

	private storeMatch(key: string): void {
		const value = store.find(key);

		if (!value) {
			store.add(key, { key, count: 1, files: [this.path] });
			return;
		}

		if (!value.files.includes(this.path)) {
			value.files.push(this.path);
		}
		value.count++;
	}

	private readlineInterface(): Interface {
		return createInterface({
			input: createReadStream(this.path, { encoding: "utf8" }),
			terminal: false,
		});
	}
}
