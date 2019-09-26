import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { extname, resolve } from 'path';
import { Findings } from './findings.interface';

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
						.forEach((line) => this.scanLine(line));
				}
			});
		}

		processFiles(dirPath, formats);

		return this.findings;
	}

	private scanLine(data: string): void {
		const state = { single: false, double: false };

		let i = 0;
		let characterSet = '';

		const storeFinding = (finding: string) => {
			if (finding.length > 0) {
				if (this.findings[finding]) {
					this.findings[finding]++;
				} else {
					this.findings[finding] = 1;
				}
			}
		};

		for (; i < data.length; i++) {
			if (data.charCodeAt(i) === 34 && state.single === false) {
				state.double = !state.double;

				if (state.double === false) {
					storeFinding(characterSet);
					characterSet = '';
				}
				continue;
			}

			if (data.charCodeAt(i) === 39 && state.double === false) {
				state.single = !state.single;

				if (state.single === false) {
					storeFinding(characterSet);
					characterSet = '';
				}
				continue;
			}

			if (state.double === true || state.single === true) {
				characterSet += data[i];
				continue;
			}
		}
	}
}
