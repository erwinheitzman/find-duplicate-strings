import { existsSync } from "node:fs";
import { extname, sep } from "node:path";
import { globSync } from "glob";

export function getFiles(path: string, ignore: string[]): string[] {
	return globSync(path, {
		nodir: true,
		realpath: true,
		absolute: true,
		matchBase: true,
	}).filter((path) => {
		return (
			path &&
			existsSync(path) &&
			path
				.split(sep)
				.every((part) =>
					ignore.length ? ignore.some((e) => part !== e) : true,
				)
		);
	}) as string[];
}
