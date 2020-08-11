import { readFileSync } from 'fs';
import { Store } from './store';
import { Finding } from './ifinding';

enum Character {
	SINGLE_QUOTE = 39,
	DOUBLE_QUOTE = 34,
	BACKSLASH = 92,
}

export class File {
	private readonly file: string;

	constructor(private store: Store<Finding>, private name: string) {
		this.file = readFileSync(name, 'utf8');
	}

	public getStrings(): void {
		this.getLines().forEach((line: string) => {
			let singleQuoteToggle = false;
			let doubleQuoteToggle = false;
			let characterSet = '';

			for (let i = 0; i < line.length; i++) {
				if (this.shouldStoreDoubleQuoteString(line, i, singleQuoteToggle)) {
					doubleQuoteToggle = !doubleQuoteToggle;

					if (doubleQuoteToggle === false && characterSet.length) {
						this.storeMatch(characterSet, this.name);
						characterSet = '';
					}
					continue;
				}

				if (this.shouldStoreSingleQuoteString(line, i, doubleQuoteToggle)) {
					singleQuoteToggle = !singleQuoteToggle;

					if (singleQuoteToggle === false && characterSet.length) {
						this.storeMatch(characterSet, this.name);
						characterSet = '';
					}
					continue;
				}

				if (doubleQuoteToggle === true || singleQuoteToggle === true) {
					characterSet += line[i];
					continue;
				}
			}
		});
	}

	private shouldStoreSingleQuoteString(line: string, index: number, toggle: boolean) {
		return (
			line.charCodeAt(index) === Character.SINGLE_QUOTE &&
			line.charCodeAt(index - 1) !== Character.BACKSLASH &&
			toggle === false
		);
	}

	private shouldStoreDoubleQuoteString(line: string, index: number, toggle: boolean) {
		return (
			line.charCodeAt(index) === Character.DOUBLE_QUOTE &&
			line.charCodeAt(index - 1) !== Character.BACKSLASH &&
			toggle === false
		);
	}

	private storeMatch(key: string, file: string): void {
		const value = this.store.find(key);

		if (!value) {
			this.store.add(key, { key, count: 1, files: [file] });
			return;
		}

		if (!value.files.includes(file)) {
			value.files.push(file);
		}

		value.count++;

		this.store.update(key, { key, count: value.count, files: value.files });
	}

	private getLines(): Array<string> {
		return this.file.split('\n');
	}
}
