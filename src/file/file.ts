import { createReadStream } from 'node:fs';
import { createInterface, type Interface } from 'node:readline';

import { Store } from '../store/store';

export class File {
	constructor(private readonly path: string) {}

	processContent(): Promise<void> {
		return new Promise((resolve) => {
			const rl = this.readlineInterface();
			rl.on('line', (line) => this.processLine(line));
			rl.on('close', () => {
				resolve();
			});
		});
	}

	private processLine(line: string): void {
		const matches = line.match(/(?:("[^"\\]*(?:\\.[^"\\]*)*")|('[^'\\]*(?:\\.[^'\\]*)*'))/g);
		const isNotEmpty = (s: string) => s && s.length > 2;

		if (matches) {
			matches.filter(isNotEmpty).forEach((match) => {
				this.storeMatch(match.substring(1, match.length - 1));
			});
		}
	}

	private storeMatch(key: string): void {
		const value = Store.find(key);

		if (!value) {
			Store.add(key, { key, count: 1, files: [this.path] });
			return;
		}

		if (!value.files.includes(this.path)) {
			value.files.push(this.path);
		}
		value.count++;
	}

	private readlineInterface(): Interface {
		return createInterface({
			input: createReadStream(this.path, { encoding: 'utf8' }),
			terminal: false,
			historySize: 0,
		});
	}
}
