import { Directory } from './directory';
import { Store } from './store';
import { File } from './file';
import { Output } from './output';
import { Exclusions } from './exclusions';
import { Extensions } from './extensions';
import {
	ConfirmDuplicatePathQuestion,
	ConfirmPathQuestion,
	ExclusionsQuestion,
	ExtensionsQuestion,
	ThresholdQuestion,
} from './cli/questions';
import { Finding } from './finding';
import { existsSync, statSync } from 'fs';
import { normalize, resolve } from 'path';
import { PathQuestion } from './cli/questions/path';
import process from 'process';

interface Options {
	silent?: boolean;
	exclusions?: string;
	extensions?: string;
	path?: string;
	threshold?: number | string;
}

export class Scanner {
	private readonly scannedDirs: string[] = [];
	private exclusions!: string[];
	private extensions!: string[];
	private threshold!: number;
	private silent: boolean;
	private path: string;

	public constructor(
		options: Options,
		private loaderInterval: number = 1000,
	) {
		if (options.exclusions) {
			this.exclusions = Exclusions.process(options.exclusions);
		}

		if (options.extensions) {
			this.extensions = Extensions.process(options.extensions);
		}

		if (options.threshold) {
			this.threshold = parseInt(options.threshold as string, 10);
		}

		this.silent = !!options.silent;
		this.path = options.path || '';
	}

	public async scan(): Promise<void> {
		const path = this.path.length ? this.path : await new PathQuestion().getAnswer();

		const fullPath = normalize(resolve(process.cwd(), path));

		if (!existsSync(fullPath)) {
			throw new Error('Invalid path: No such directory or file.');
		}

		const lstat = statSync(fullPath);

		if (!this.exclusions && lstat.isDirectory()) {
			const answer = await new ExclusionsQuestion().getAnswer();
			this.exclusions = Exclusions.process(answer);
		}

		if (!this.extensions && lstat.isDirectory()) {
			const answer = await new ExtensionsQuestion().getAnswer();
			this.extensions = Extensions.process(answer);
		}

		if (!this.threshold) {
			const answer = await new ThresholdQuestion().getAnswer();
			this.threshold = parseInt(answer, 10);
		}

		let shouldScan = true;

		if (this.scannedDirs.includes(path)) {
			shouldScan = await new ConfirmDuplicatePathQuestion().getAnswer();
		}

		if (shouldScan) {
			await this.initScan(path);
		}

		const continueScanning = await new ConfirmPathQuestion().getAnswer();

		if (continueScanning) {
			this.path = '';
			return this.scan();
		}

		const duplicates = this.getDuplicates();

		if (!duplicates.length) {
			console.log('No duplicates where found.');
			return;
		}

		await new Output(duplicates as Finding[], this.silent).output();
	}

	private async scanDir(path: string): Promise<void> {
		const directory = new Directory(path, this.exclusions, this.extensions);
		const files = directory.getFiles();

		for await (const file of files) {
			await this.scanFile(file);
		}
	}

	private async scanFile(path: string): Promise<void> {
		await new File(path).processContent();
	}

	private getDuplicates(): Finding[] {
		return Store.getAll().filter((value) => value.count > this.threshold);
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
