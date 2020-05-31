import { readdirSync, existsSync, statSync } from 'fs';
import { resolve, extname } from 'path';

export class Directory {
	constructor(private directory: string) {}

	public scan(exclusions: string, extensions: string): Array<string> {
		const filesList: Array<string> = [];
		const exclusionsList = exclusions.split(';');
		const extensionsList = extensions.split(';').map((extension) => {
			if (extension.startsWith('.')) {
				return extension.substr(1, extension.length);
			}
			return extension;
		});
		const resolvedPath = resolve(process.cwd(), this.directory);

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
				if (!extensions.length || extensionsList.includes(extension)) {
					filesList.push(fullPath);
				}
			});
		};

		readdirRecursively(resolvedPath);

		return filesList;
	}
}
