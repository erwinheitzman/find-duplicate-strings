import { readdirSync, existsSync, statSync } from 'fs';
import { resolve, extname } from 'path';

export class Directory {
	private readonly resolvedDir: string;

	constructor(directory: string, private exclusions: string[], private extensions: string[]) {
		this.resolvedDir = resolve(process.cwd(), directory);

		if (!existsSync(this.resolvedDir)) {
			throw new Error('Directory does not exist, please pass a valid path.');
		}
	}

	public getFiles(): string[] {
		return this.readdirRecursively(this.resolvedDir);
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
