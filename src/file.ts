import { createInterface, Interface } from 'readline';
import { createReadStream } from 'fs';
import { Store } from './store';
import { Finding } from './finding';

export class File {
	constructor(private name: string) {}

	processContent(): Interface {
		const rl = this.readlineInterface();

		rl.on('line', (line) => this.processLine(line));

		return rl;
	}

	private processLine(line: string): void {
		const matches = line.match(/(?:("[^"\\]*(?:\\.[^"\\]*)*")|('[^'\\]*(?:\\.[^'\\]*)*'))/g);

		if (matches) {
			matches
				.filter((match) => match && match.length > 2)
				.forEach((match) => {
					this.storeMatch(match.substring(1, match.length - 1), this.name);
				});
		}
	}

	private storeMatch(key: string, file: string): void {
		const value = Store.find(key) as Finding;

		if (!value) {
			Store.add(key, { key, count: 1, files: [file] });
			return;
		}

		if (!value.files.includes(file)) {
			value.files.push(file);
		}

		value.count++;

		Store.update(key, { key, count: value.count, files: value.files });
	}

	private readlineInterface(): Interface {
		return createInterface({
			input: createReadStream(this.name, { encoding: 'utf8' }),
			terminal: false,
		});
	}
}
