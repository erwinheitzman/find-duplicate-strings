import { Directory } from '../directory/directory';
import { Store } from '../store/store';
import { File } from '../file/file';
import { Output } from '../output/output';
import { Exclusions } from '../exclusions/exclusions';
import { Extensions } from '../extensions/extensions';
import {
	ConfirmDuplicatePathQuestion,
	ExclusionsQuestion,
	ExtensionsQuestion,
	ThresholdQuestion,
} from '../cli/questions';
import { Finding } from '../typings/finding';
import { existsSync, statSync } from 'node:fs';
import { normalize, resolve } from 'node:path';
import { PathQuestion } from '../cli/questions/path';
import process from 'node:process';

interface Options {
	exclusions?: string;
	extensions?: string;
	output?: string;
	interactive?: boolean;
	path?: string;
	threshold?: number | string;
}

export class Scanner {
	private readonly scannedDirs: string[] = [];
	private exclusions!: string[] | undefined;
	private extensions!: string[] | undefined;
	private threshold!: number | undefined;
	private output!: string;
	private interactive!: boolean;
	private path: string;

	public constructor(
		options: Options,
		private loaderInterval: number = 1000,
	) {
		this.exclusions = options.exclusions
			? Exclusions.process(options.exclusions)
			: options.interactive
				? undefined
				: [];
		this.extensions = options.extensions
			? Extensions.process(options.extensions)
			: options.interactive
				? undefined
				: [];
		this.threshold = options.threshold
			? parseInt(options.threshold as string, 10)
			: options.interactive
				? undefined
				: 1;
		this.output = options.output ?? 'fds-output';
		this.interactive = options.interactive ?? false;
		this.path = options.path ?? '';
	}

	public async scan(): Promise<void> {
		const path = this.path.length ? this.path : await new PathQuestion().getAnswer();

		const fullPath = normalize(resolve(process.cwd(), path));

		if (!existsSync(fullPath)) {
			throw new Error('Invalid path: No such directory or file.');
		}

		const lstat = statSync(fullPath);

		if (!this.exclusions && lstat.isDirectory()) {
			if (this.interactive) {
				const answer = await new ExclusionsQuestion().getAnswer();
				this.exclusions = Exclusions.process(answer);
			}
		}

		if (!this.extensions && lstat.isDirectory()) {
			if (this.interactive) {
				const answer = await new ExtensionsQuestion().getAnswer();
				this.extensions = Extensions.process(answer);
			}
		}

		if (!this.threshold) {
			if (this.interactive) {
				const answer = await new ThresholdQuestion().getAnswer();
				this.threshold = parseInt(answer, 10);
			}
		}

		let shouldScan = true;

		if (this.scannedDirs.includes(path)) {
			shouldScan = await new ConfirmDuplicatePathQuestion().getAnswer();
		}

		if (shouldScan) {
			await this.initScan(path);
		}

		const duplicates = this.getDuplicates();

		if (!duplicates.length) {
			console.log('No duplicates where found.');
			return;
		}

		await new Output(duplicates as Finding[], this.output).output();
	}

	private async scanDir(path: string): Promise<void> {
		const directory = new Directory(path, this.exclusions as string[], this.extensions as string[]);
		const files = directory.getFiles();

		for await (const file of files) {
			await this.scanFile(file);
		}
	}

	private async scanFile(path: string): Promise<void> {
		await new File(path).processContent();
	}

	private getDuplicates(): Finding[] {
		return Store.getAll().filter((value) => value.count > (this.threshold as number));
	}

	private async initScan(path: string) {
		let count = 0;

		const clearLine = () => {
			process.stdout.clearLine(0);
			process.stdout.cursorTo(0);
		};

		const loader = setInterval(() => {
			count++;
			if (count > 10) {
				count = 0;
				clearLine();
				return;
			}

			process.stdout.write('.');
		}, this.loaderInterval);

		const clearLoader = () => {
			clearInterval(loader);
			process.removeAllListeners('SIGTERM');
			clearLine();
		};

		process.on('SIGTERM', () => {
			clearInterval(loader);
		});

		const lstat = statSync(path);

		if (lstat.isFile()) {
			await this.scanFile(path);
		}

		if (lstat.isDirectory()) {
			await this.scanDir(path);
		}

		clearLoader();
		this.scannedDirs.push(path);
	}
}
