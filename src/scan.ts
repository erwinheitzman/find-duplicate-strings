import { readdirSync, readFileSync, statSync } from 'fs';
import { resolve } from 'path';

const findings: { [key: string]: number; } = {};

function scanLine(data: string) {
	const states = { 'single': false, 'double': false };

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
		if (data.charCodeAt(i) === 34 && states['single'] === false) {
			states['double'] = !states['double'];

			if (states['double'] === false) {
				storeFinding(characterSet);
				characterSet = '';
			}
			continue;
        }

        if (data.charCodeAt(i) === 39 && states['double'] === false) {
			states['single'] = !states['single'];

			if (states['single'] === false) {
				storeFinding(characterSet);
				characterSet = '';
			}
			continue;
		}

		if (states['double'] === true || states['single'] === true) {
			characterSet += data[i];
			continue;
        }
    }
}

export function getFiles(dirPath: string) {
    readdirSync(dirPath).forEach((filePath) => {
        const fullPath = resolve(dirPath, filePath);

        if (statSync(fullPath).isDirectory()) {
            return getFiles(fullPath);
        }

        const file = readFileSync(fullPath, 'utf8');

        file.split('\n').forEach((line) => {
            scanLine(line);
        });
    });

    return findings;
}
