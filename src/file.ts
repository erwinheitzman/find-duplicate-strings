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
			let settingSingleQuoteMatch = false;
			let settingDoubleQuoteMatch = false;
			let characterSet = '';

			for (let i = 0; i < line.length; i++) {
				if (
					line.charCodeAt(i) === Character.DOUBLE_QUOTE &&
					line.charCodeAt(i - 1) !== Character.BACKSLASH &&
					settingSingleQuoteMatch === false
				) {
					settingDoubleQuoteMatch = !settingDoubleQuoteMatch;

					if (settingDoubleQuoteMatch === false) {
						if (characterSet.length) {
							this.storeMatch(characterSet, this.name);
						}
						characterSet = '';
					}
					continue;
				}

				if (
					line.charCodeAt(i) === Character.SINGLE_QUOTE &&
					line.charCodeAt(i - 1) !== Character.BACKSLASH &&
					settingDoubleQuoteMatch === false
				) {
					settingSingleQuoteMatch = !settingSingleQuoteMatch;

					if (settingSingleQuoteMatch === false) {
						if (characterSet.length) {
							this.storeMatch(characterSet, this.name);
						}
						characterSet = '';
					}
					continue;
				}

				if (settingDoubleQuoteMatch === true || settingSingleQuoteMatch === true) {
					characterSet += line[i];
					continue;
				}
			}
		});
	}

	private storeMatch(key: string, file: string) {
		const value = this.store.find(key);

		if (value) {
			if (!value.files.includes(file)) {
				value.files.push(file);
			}

			value.count++;

			this.store.update(key, { key, count: value.count, files: value.files });
		} else {
			this.store.add(key, { key, count: 1, files: [file] });
		}
	}

	private getLines(): Array<string> {
		return this.file.split('\n');
	}
}
