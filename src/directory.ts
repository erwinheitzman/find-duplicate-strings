import { readdirSync, existsSync, statSync } from 'fs';
import { resolve, extname } from 'path';

export class Directory {
	public scan(dirPath: string, exclusions: string, extensions: Array<'js' | 'ts' | 'json'>): Array<string> {
		const filesList: Array<string> = [];
		const exclusionsList = exclusions.split(';');
		const resolvedPath = resolve(process.cwd(), dirPath);

		if (!existsSync(resolvedPath)) {
			throw new Error('Directory does not exist, please pass a valid path.');
		}

		const readdirRecursively = (path: string): void => {
			readdirSync(path).forEach((file) => {
				const fullPath = resolve(path, file);

				if (statSync(fullPath).isDirectory()) {
					if (exclusionsList.includes(file)) {
						return;
					}

					return readdirRecursively(fullPath);
				}

				const extension = extname(fullPath).substr(1);
				if (!extensions.length || (extensions as Array<string>).includes(extension)) {
					filesList.push(fullPath);
				}
			});
		};

		readdirRecursively(resolvedPath);

		return filesList;
	}
}
