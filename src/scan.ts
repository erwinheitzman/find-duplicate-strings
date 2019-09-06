import { readdirSync, readFileSync, statSync } from 'fs';
import { resolve } from 'path';

function foo(_line: string) {
    const len = _line.length;
    const singleQuoteCharCode = 34;
    const doubleQuoteCharCode = 39;

    let i = 0;
    let str = '';
    let activeSingle = false;
    let activeDouble = false;

    for (; i < len; i++) {
        if (_line.charCodeAt(i) === 34 && activeSingle === false) {
            if (activeDouble === true) {
                if (str.length > 0) {
                    if (findings[str]) {
                        findings[str]++;
                    } else {
                        findings[str] = 1;
                    }
                }
                str = '';
                activeDouble = false;
                continue;
            }

            activeDouble = true;
            continue;
        }

        if (_line.charCodeAt(i) === 39 && activeDouble === false) {
            if (activeSingle === true) {
                if (str.length > 0) {
                    if (findings[str]) {
                        findings[str]++;
                    } else {
                        findings[str] = 1;
                    }
                }
                str = '';
                activeSingle = false;
                continue;
            }

            activeSingle = true;
            continue;
        }

        if (activeDouble === true || activeSingle === true) {
            str += _line[i];
            continue;
        }
    }
}

const findings: { [key: string]: number; } = {};

export function getFiles(dirPath: string) {
    readdirSync(dirPath).forEach((filePath) => {
        const fullPath = resolve(dirPath, filePath);

        if (statSync(fullPath).isDirectory()) {
            return getFiles(fullPath);
        }

        const file = readFileSync(fullPath, 'utf8');

        file.split('\n').forEach((line) => {
            foo(line);
        });
    });

    return findings;
}
