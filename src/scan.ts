import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { resolve } from 'path';

const findings: { [key: string]: number; } = {};

function scanLine(data: string) {
	const state = { single: false, double: false };

	let i = 0;
	let characterSet = '';

	const storeFinding = (finding: string) => {
		if (finding.length > 0) {
			if (findings[finding]) {
				findings[finding]++;
			} else {
				findings[finding] = 1;
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

export function scanDir(dirPath: string) {
    readdirSync(dirPath).forEach((filePath) => {
        const fullPath = resolve(dirPath, filePath);

        if (statSync(fullPath).isDirectory()) {
            return scanDir(fullPath);
        }

        readFileSync(fullPath, 'utf8')
			.split('\n')
			.forEach((line) => scanLine(line));
    });

    return findings;
}
