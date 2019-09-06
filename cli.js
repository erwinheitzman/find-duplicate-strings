const commander = require('commander');
const inquirer = require('inquirer');
const program = new commander.Command();
const getFiles = require('./index');
const path = require('path');
const prompt = inquirer.createPromptModule();
const fs = require('fs');

function init() {
    prompt([{
        name: 'scanPath',
        message: 'Please pass a directory to scan for duplicate values.',
    }]).then(({ scanPath }) => {
        const resolvedPath = path.resolve(process.cwd(), scanPath);

        if (!fs.existsSync(resolvedPath)) {
            throw new Error('Directory does not exist, please pass a valid path.');
        }

        const findings = getFiles(path.resolve(process.cwd(), scanPath));
        console.table(findings);
    
        prompt([{
            name: 'writePath',
            message: 'Please pass a filepath to store the values.',
        }]).then(({ writePath }) => {
            writePath = path.resolve(process.cwd(), writePath);
    
            if (writePath.endsWith('.js')) {
                const data = [];
    
                Object.keys(findings).forEach((finding, i) => {
                    data.push(`const string${i} = '${finding}';`);
                });
    
                fs.writeFileSync(writePath, data.join('\n'), 'utf8');
                return;
            }
    
            if (writePath.endsWith('.json')) {
                const data = {};
    
                Object.keys(findings).forEach((finding, i) => {
                    data[`string${i}`] = `${finding}`;
                });
    
                fs.writeFileSync(writePath, JSON.stringify(data, null, 2), 'utf8');
                return;
            }
    
            throw new Error('sdfsdf');
        });
    });
}

program
    .option('-r, run', 'run squisher', init)

program.parse(process.argv);