import type { Finding } from '../typings/finding';

export const findings: Finding[] = [
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

export const manyFindings: Finding[] = Array.from({ length: 15 }).map((_, i) => ({
	count: i + 1,
	files: ['dummy/path/' + (i + 1)],
	key: 'foo',
}));
