import { createInterface, Interface } from 'readline';
import { createReadStream } from 'fs';
import { Store } from './store';

export class File {
	constructor(private readonly name: string) {}

	processContent(): Promise<any> {
		return new Promise((resolve) => {
			const rl = this.readlineInterface();
			rl.on('line', (line) => this.processLine(line));
			rl.on('close', () => {
				resolve(true);
			});
		});
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
		const value = Store.find(key);

		if (!value) {
			Store.add(key, { key, count: 1, files: [file] });
			return;
		}

		if (!value.files.includes(file)) {
			value.files.push(file);
		}

		Store.update(key, { key, count: (value.count += 1), files: value.files });
	}

	private readlineInterface(): Interface {
		return createInterface({
			input: createReadStream(this.name, { encoding: 'utf8' }),
			terminal: false,
		});
	}
}
