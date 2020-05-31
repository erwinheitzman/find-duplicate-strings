import { readdirSync, existsSync, statSync } from 'fs';
import { resolve, extname } from 'path';

export class Directory {
	constructor(private directory: string) {}

	public scan(exclusions: string, extensions: string): Array<string> {
		const filesList: Array<string> = [];
		const resolvedPath = resolve(process.cwd(), this.directory);

		if (!existsSync(resolvedPath)) {
			throw new Error('Directory does not exist, please pass a valid path.');
		}

		const readdirRecursively = (path: string): void => {
			readdirSync(path).forEach((file) => {
				const fullPath = resolve(path, file);

				if (statSync(fullPath).isDirectory()) {
					if (this.parseStringList(exclusions).includes(file)) {
						return;
					}

					return readdirRecursively(fullPath);
				}

				const extension = extname(fullPath).substr(1);
				if (!extensions.length || this.parseExtensionsStringList(extensions).includes(extension)) {
					filesList.push(fullPath);
				}
			});
		};

		readdirRecursively(resolvedPath);

		return filesList;
	}

	private parseStringList(stringList: string): Array<string> {
		return stringList.split(';');
	}

	private parseExtensionsStringList(extensionsStringList: string): Array<string> {
		return this.parseStringList(extensionsStringList).map((extension) => {
			if (extension.startsWith('.')) {
				return extension.substr(1, extension.length);
			}
			return extension;
		});
	}
}
