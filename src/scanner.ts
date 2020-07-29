import { Directory } from './directory';
import { Store } from './store';
import { File } from './file';
import { Finding } from './ifinding';
import { Output } from './output';
import { Extensions } from './extensions';
import {
	DirectoryQuestion,
	ExclusionsQuestion,
	ExtensionsQuestion,
	ConfirmDirectoryQuestion,
	ConfirmScannedDirQuestion,
} from './cli/questions';

interface Options {
	silent?: boolean;
	exclusions?: string;
	extensions?: string;
	path?: string;
	threshold?: number | string;
}

const { removeDotPrefix } = new Extensions();

export class Scanner {
	private readonly scannedDirs: string[] = [];
	private readonly store = new Store<Finding>();
	private silent: boolean;
	private exclusions!: string[];
	private extensions!: string[];
	private path: string;
	private threshold: number;

	public constructor(options: Options) {
		this.path = options.path || '';
		this.silent = !!options.silent;
		this.threshold = typeof options.threshold !== 'undefined' ? parseInt(options.threshold as string, 10) : 1;

		if (options.exclusions) {
			this.exclusions = options.exclusions.split(',');
		}

		if (options.extensions) {
			this.extensions = removeDotPrefix(options.extensions.split(','));
		}
	}

	public async scan(): Promise<void> {
		const path = this.path.length ? this.path : await new DirectoryQuestion().getAnswer();

		if (!this.exclusions) {
			this.exclusions = await new ExclusionsQuestion().getAnswer();
		}

		if (!this.extensions) {
			this.extensions = await new ExtensionsQuestion().getAnswer();
		}

		let shouldScan = true;

		if (this.scannedDirs.includes(path)) {
			shouldScan = await new ConfirmScannedDirQuestion().getAnswer();
		}

		if (shouldScan) {
			this.scanDir(path);
			this.scannedDirs.push(path);
		}

		const continueScanning = await new ConfirmDirectoryQuestion().getAnswer();

		if (continueScanning) {
			return this.scan();
		}

		const duplicates = this.getDuplicates(this.store);

		if (!duplicates.length) {
			console.log('No duplicates where found.');
			return;
		}

		await new Output(duplicates, this.silent).output();
	}

	private scanDir(dirName: string) {
		const directory = new Directory(dirName, this.exclusions, this.extensions);
		const files = directory.getFiles();

		for (const file of files) {
			new File(this.store, file).getStrings();
		}
	}

	private getDuplicates(store: Store<Finding>) {
		return store.getAll().filter((value) => value.count > this.threshold);
	}
}
