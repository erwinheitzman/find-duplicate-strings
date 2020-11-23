import { promises, existsSync, statSync } from 'fs';
import { resolve, extname } from 'path';

export class Directory {
	private readonly path: string;

	constructor(directory: string, private exclusions: string[], private extensions: string[]) {
		this.path = resolve(process.cwd(), directory);

		if (!existsSync(this.path)) {
			throw new Error('Directory does not exist, please pass a valid path.');
		}

		if (!statSync(this.path).isDirectory()) {
			throw new Error('Path does not point to a directory.');
		}
	}

	public getFiles(): AsyncGenerator<string, void, unknown> {
		return this.readdirRecursively(this.path);
	}

	private async *readdirRecursively(path: string): AsyncGenerator<string, void, unknown> {
		const dirents = await promises.readdir(path, { withFileTypes: true });

		for (const dirent of dirents) {
			if (this.exclusions.includes(dirent.name)) {
				continue;
			}

			const fullPath = resolve(path, dirent.name);

			if (dirent.isDirectory()) {
				yield* this.readdirRecursively(fullPath);
			} else {
				console.log('!this.extensions.length: ', !this.extensions.length);
				const extension = extname(dirent.name).substr(1);
				console.log('this.extensions.includes(extension): ', this.extensions.includes(extension));

				if (!this.extensions.length || this.extensions.includes(extension)) {
					yield fullPath;
				}
			}
		}
	}
}
