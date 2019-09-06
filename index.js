const fs = require('fs');
const path = require('path');
const program = require('commander');

// TODO: use console.table for the output
// TODO: make recursive

function foo(_line) {
    let i = 0;
    const len = _line.length;

    let str = '';
    let activeSingle = false;
    let activeDouble = false;

    for (; i < len; i++) {
        if (_line[i].charCodeAt() === 34 && activeSingle === false) {
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

        if (_line[i].charCodeAt() === 39 && activeDouble === false) {
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

const findings = {};

module.exports = function getFiles(dirPath) {
    fs.readdirSync(dirPath).forEach((filePath) => {
        const fullPath = path.resolve(dirPath, filePath);

        if (fs.statSync(fullPath).isDirectory()) {
            return getFiles(fullPath);
        }

        const file = fs.readFileSync(fullPath, 'utf8');

        file.split('\n').forEach((line) => {
            foo(line);
        });
    });

    return findings;
}