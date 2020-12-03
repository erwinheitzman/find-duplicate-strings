import type { Finding } from './finding';

const findings: Finding[] = [
	{
		count: 1,
		files: ['dummy/path/1'],
		key: 'foo',
	},
	{
		count: 2,
		files: ['dummy/path/2'],
		key: 'foo',
	},
];

const manyFindings: Finding[] = [...findings];

for (let i = 3; i <= 15; i++) {
	manyFindings.push({
		count: i,
		files: ['dummy/path/' + i],
		key: 'foo',
	});
}

export { findings, manyFindings };
