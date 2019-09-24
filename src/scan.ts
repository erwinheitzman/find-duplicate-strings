import { readdirSync, readFileSync, statSync } from 'fs';
import { resolve } from 'path';

const findings: { [key: string]: number; } = {};

function scanLine(data: string) {
	const states = { 'single': false, 'double': false };
    const len = data.length;

	function storeFinding(type: 'single' | 'double') {
		if (states[type] === true) {
			if (str.length > 0) {
				if (findings[str]) {
					findings[str]++;
				} else {
					findings[str] = 1;
				}
			}
			str = '';
			states[type] = false;
		} else {
			states[type] = true;
		}
	}

	let i = 0;
	let str = '';

    for (; i < len; i++) {
		if (data.charCodeAt(i) === 34 && states['single'] === false) {
			storeFinding('double');
			return;
        }

        if (data.charCodeAt(i) === 39 && states['double'] === false) {
			storeFinding('single');
			return;
		}

		if (states['double'] === true || states['single'] === true) {
			str += data[i];
			return;
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
