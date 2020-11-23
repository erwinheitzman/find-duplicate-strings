import { Directory } from './directory';
import { Store } from './store';
import { File } from './file';
import { Output } from './output';
import { Exclusions } from './exclusions';
import { Extensions } from './extensions';
import {
	DirectoryQuestion,
	ExclusionsQuestion,
	ExtensionsQuestion,
	ConfirmDirectoryQuestion,
	ConfirmScannedDirQuestion,
	ThresholdQuestion,
} from './cli/questions';
import type { Finding } from './finding';

interface Options {
	silent?: boolean;
	exclusions?: string;
	extensions?: string;
	path?: string;
	threshold?: number | string;
}

export class Scanner {
	private readonly scannedDirs: string[] = [];
	private readonly store = Store;
	private exclusions!: string[];
	private extensions!: string[];
	private threshold!: number | string;
	private silent: boolean;
	private path: string;

	public constructor(options: Options) {
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
		const path = this.path.length ? this.path : await new DirectoryQuestion().getAnswer();

		if (!this.exclusions) {
			const answer = await new ExclusionsQuestion().getAnswer();
			this.exclusions = Exclusions.process(answer);
		}

		if (!this.extensions) {
			const answer = await new ExtensionsQuestion().getAnswer();
			this.extensions = Extensions.process(answer);
		}

		if (!this.threshold) {
			const answer = await new ThresholdQuestion().getAnswer();
			this.threshold = parseInt(answer, 10);
		}

		let shouldScan = true;

		if (this.scannedDirs.includes(path)) {
			shouldScan = await new ConfirmScannedDirQuestion().getAnswer();
		}

		if (shouldScan) {
			try {
				await this.scanDir(path);
			} catch (error) {
				console.log(error);
				this.store.clear();
			}

			this.scannedDirs.push(path);
		}

		const continueScanning = await new ConfirmDirectoryQuestion().getAnswer();

		if (continueScanning) {
			return this.scan();
		}

		const duplicates = this.getDuplicates();

		if (!duplicates.length) {
			console.log('No duplicates where found.');
			return;
		}

		await new Output(duplicates as Finding[], this.silent).output();

		this.store.clear();
	}

	private async scanDir(dirName: string) {
		const directory = new Directory(dirName, this.exclusions, this.extensions);
		const files = directory.getFiles();

		for await (const file of files) {
			new File(file).processContent();
		}
	}

	private getDuplicates() {
		const duplicates = Store.getAll().filter((value: any) => value.count > this.threshold);
		Store.save();
		return duplicates;
	}
}
