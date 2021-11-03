import { promises, existsSync, statSync } from 'fs';
import { resolve, extname, normalize, join } from 'path';

export class Directory {
	private readonly path: string;

	constructor(directory: string, private readonly exclusions: string[], private readonly extensions: string[]) {
		this.path = normalize(resolve(process.cwd(), directory));

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

	// TODO: support reading single file
	private async *readdirRecursively(path: string): AsyncGenerator<string, void, unknown> {
		const stream = await promises.readdir(path, { withFileTypes: true });

		for (const dirent of stream) {
			if (this.exclusions.includes(dirent.name)) {
				continue;
			}

			let fullPath = join(path, dirent.name);
			let isLink = false;

			if (dirent.isSymbolicLink()) {
				try {
					fullPath = await promises.realpath(fullPath);
					isLink = true;
				} catch (error: any) {
					if (error.message.includes('ENOENT')) {
						continue; // ignore broken symlinks
					}
					throw error;
				}
			}

			const isDir = isLink ? (await promises.lstat(fullPath)).isDirectory() : dirent.isDirectory();

			if (isDir) {
				yield* this.readdirRecursively(fullPath);
			} else {
				const extension = extname(dirent.name).substr(1);

				if (!this.extensions.length || this.extensions.includes(extension)) {
					yield fullPath;
				}
			}
		}
	}
}
