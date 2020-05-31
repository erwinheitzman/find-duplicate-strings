import { readFileSync } from 'fs';
import { Store } from './store';

export interface Finding {
	count: number;
	files: Array<string>;
}

export class File {
	private readonly file: string;

	constructor(private name: string) {
		this.file = readFileSync(name, 'utf8');
	}

	public findAndStoreStringValues(): void {
		const isSingleQuote = (line: string, index: number) => line.charCodeAt(index) === 39;
		const isDoubleQuote = (line: string, index: number) => line.charCodeAt(index) === 34;
		const isEscaped = (line: string, index: number) => line.charCodeAt(index - 1) !== 92;

		const lines = this.getLines();

		lines.forEach((line: string) => {
			let settingSingleQuoteMatch = false;
			let settingDoubleQuoteMatch = false;
			let characterSet = '';

			for (let i = 0; i < line.length; i++) {
				if (isDoubleQuote(line, i) && isEscaped(line, i) && settingSingleQuoteMatch === false) {
					settingDoubleQuoteMatch = !settingDoubleQuoteMatch;

					if (settingDoubleQuoteMatch === false) {
						if (characterSet.length) {
							this.storeMatch(characterSet, this.name);
						}
						characterSet = '';
					}
					continue;
				}

				if (isSingleQuote(line, i) && isEscaped(line, i) && settingDoubleQuoteMatch === false) {
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

	private storeMatch(finding: string, file: string) {
		const value = Store.find(finding) as Finding;

		if (value) {
			if (!value.files.includes(file)) {
				value.files.push(file);
			}

			value.count++;

			Store.update(finding, { count: value.count, files: value.files });
		} else {
			Store.add(finding, { count: 1, files: [file] });
		}
	}

	private getLines(): Array<string> {
		return this.file.split('\n');
	}
}
