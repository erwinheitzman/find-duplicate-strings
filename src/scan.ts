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

	public scanDir(dirPath: string, extensions: Array<string>): Findings {
		this.findings = {};

		const processFiles = (_dirPath: string, _extensions: Array<string>) => {
			readdirSync(_dirPath).forEach((_filePath) => {
				const fullPath = resolve(_dirPath, _filePath);

				if (statSync(fullPath).isDirectory()) {
					return processFiles(fullPath, _extensions);
				}

				const extension = extname(fullPath).substr(1);

				if (_extensions.includes(extension)) {
					readFileSync(fullPath, 'utf8')
						.split('\n')
						.forEach((line) => this.scanLine(line, fullPath));
				}
			});
		};

		processFiles(dirPath, extensions);

		return this.findings;
	}

	private scanLine(line: string, filePath: string): void {
		const DOUBLE_QUOTES = 34;
		const SIGNLE_QUOTES = 39;
		const BACKSLASH = 92;

		let singleQuote = false;
		let doubleQuote = false;
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
				}
			}
		};

		for (let i = 0; i < line.length; i++) {
			if (line.charCodeAt(i) === DOUBLE_QUOTES && line.charCodeAt(i - 1) !== BACKSLASH && singleQuote === false) {
				doubleQuote = !doubleQuote;

				if (doubleQuote === false) {
					storeFinding(characterSet);
					characterSet = '';
				}
				continue;
			}

			if (line.charCodeAt(i) === SIGNLE_QUOTES && line.charCodeAt(i - 1) !== BACKSLASH && doubleQuote === false) {
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
