import { readdirSync, readFileSync, statSync } from 'fs';
import { extname, resolve } from 'path';

export interface Findings {
	[key: string]: Finding;
}

export interface Finding {
	count: number;
	files: Array<string>;
}

export class Scanner {
	private findings: Findings;

	constructor() {
		this.findings = {};
	}

	public scanDir(dirPath: string, formats: Array<string>): Findings {
		this.findings = {};

		const processFiles = (_dirPath: string, _formats: Array<string>) => {
			readdirSync(_dirPath).forEach((_filePath) => {
				const fullPath = resolve(_dirPath, _filePath);

				if (statSync(fullPath).isDirectory()) {
					return processFiles(fullPath, _formats);
				}

				const extension = extname(fullPath);
				const format = extension.substring(1, extension.length);

				if (_formats.includes(format)) {
					readFileSync(fullPath, 'utf8')
						.split('\n')
						.forEach((line) => this.scanLine(line, fullPath));
				}
			});
		};

		processFiles(dirPath, formats);

		return this.findings;
	}

	private scanLine(line: string, filePath: string): void {
		let singleQuote = false;
		let doubleQuote = false;

		let i = 0;
		let characterSet = '';

		const storeFinding = (finding: string) => {
			if (finding.length > 0) {
				if (this.findings[finding]) {
					this.findings[finding].count++;
					if (!this.findings[finding].files.includes(filePath)) {
						this.findings[finding].files.push(resolve(filePath));
					}
				} else {
					this.findings[finding] = { count: 1, files: [filePath] };
					this.findings[finding].count = 1;
				}
			}
		};

		function isCharCodeEscapedAt(line: string, index: number): boolean {
			if (line.charCodeAt(index - 1) === 92) {
				if (line.charCodeAt(index - 2) !== 92) {
					return true;
				} else {
					return isCharCodeEscapedAt(line, index - 2);
				}
			}

			return false;
		}

		for (; i < line.length; i++) {
			if (line.charCodeAt(i) === 34 && singleQuote === false) {
				if (isCharCodeEscapedAt(line, i) === true) {
					characterSet += line[i];
					continue;
				}

				doubleQuote = !doubleQuote;

				if (doubleQuote === false) {
					storeFinding(characterSet);
					characterSet = '';
				}
				continue;
			}

			if (line.charCodeAt(i) === 39 && doubleQuote === false) {
				if (isCharCodeEscapedAt(line, i) === true) {
					characterSet += line[i];
					continue;
				}

				singleQuote = !singleQuote;

				if (singleQuote === false) {
					storeFinding(characterSet);
					characterSet = '';
				}
				continue;
			}

			if (doubleQuote === true || singleQuote === true) {
				characterSet += line[i];
				continue;
			}
		}
	}
}
