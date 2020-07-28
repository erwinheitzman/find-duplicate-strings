import { readdirSync, existsSync, statSync } from 'fs';
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

	public getFiles(): string[] {
		return this.readdirRecursively(this.path);
	}

	private readdirRecursively = (path: string): string[] => {
		const files: string[] = [];

		readdirSync(path).forEach((file) => {
			if (this.exclusions.includes(file)) {
				return;
			}

			const fullPath = resolve(path, file);

			if (statSync(fullPath).isDirectory()) {
				files.push(...this.readdirRecursively(fullPath));
				return;
			}

			const extension = extname(fullPath).substr(1);

			if (!this.extensions.length || this.extensions.includes(extension)) {
				files.push(fullPath);
			}
		});

		return files;
	};
}
