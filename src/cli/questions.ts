export const questions = {
	scan: {
		name: 'scanPath',
		message: 'Please provide a directory to scan for duplicate values.',
		type: 'input',
	},
	exclusions: {
		name: 'exclusions',
		message: 'Please provide any directories that you want to skip (separated list by ;)',
		type: 'input',
		default: 'node_modules',
	},
	extensions: {
		name: 'extensions',
		message:
			'Please provide the file extensions you want to scan or leave empty to scan all files (separated list by ;)',
		type: 'input',
	},
	write: {
		name: 'writePath',
		message: 'Please provide a filepath to store the output.',
		type: 'input',
	},
};
