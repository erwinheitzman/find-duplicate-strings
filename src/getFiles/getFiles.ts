import { existsSync } from 'node:fs';
import { extname, sep } from 'node:path';
import { globSync } from 'glob';

export function getFiles(path: string, exclusions: string[], extensions: string[]): string[] {
	return globSync(path, { nodir: true, realpath: true, absolute: true, matchBase: true }).filter((path) => {
		return (
			path &&
			existsSync(path) &&
			path.split(sep).every((part) => (exclusions.length ? exclusions.some((e) => part !== e) : true)) &&
			(extensions.length ? extensions.includes(extname(path)) : true)
		);
	}) as string[];
}
