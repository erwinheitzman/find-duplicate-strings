import { promises } from 'node:fs';
import { extname, join } from 'node:path';

export class Directory {
	private files: Promise<string>[] = [];

	constructor(
		private readonly path: string,
		private readonly exclusions: string[] | undefined,
		private readonly extensions: string[] | undefined,
	) {}

	public getFiles(): AsyncGenerator<string> {
		return this.readdirRecursively(this.path);
	}

	private async *readdirRecursively(path: string): AsyncGenerator<string> {
		const stream = await promises.readdir(path, { withFileTypes: true });

		for (const dirent of stream) {
			if (this.exclusions?.includes(dirent.name)) {
				continue;
			}

			let fullPath = join(path, dirent.name);
			let isLink = false;

			if (dirent.isSymbolicLink()) {
				try {
					fullPath = await promises.realpath(fullPath);
					isLink = true;
				} catch (error: unknown) {
					if (error instanceof Error && error.message.includes('ENOENT')) {
						continue; // ignore broken symlinks
					}
					throw error;
				}
			}

			const isDir = isLink ? (await promises.lstat(fullPath)).isDirectory() : dirent.isDirectory();

			if (isDir) {
				yield* this.readdirRecursively(fullPath);
			} else {
				const extension = extname(dirent.name).substring(1);

				if (!this.extensions?.length || this.extensions.includes(extension)) {
					yield fullPath;
				}
			}
		}
	}
}
