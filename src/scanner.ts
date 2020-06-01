import { Directory } from './directory';
import { Store } from './store';
import { File } from './file';
import { Finding } from './ifinding';
import { Output } from './output';
import {
	DirectoryQuestion,
	ExclusionsQuestion,
	ExtensionsQuestion,
	ConfirmDirectoryQuestion,
	ConfirmScannedDirQuestion,
} from './cli/questions';

export class Scanner {
	private readonly scannedDirs: string[] = [];
	private readonly store = new Store<Finding>();
	private exclusions: string[] = [];
	private extensions: string[] = [];

	public constructor(private silent: boolean) {}

	public async init(): Promise<Scanner> {
		this.exclusions = await new ExclusionsQuestion().getAnswer();
		this.extensions = await new ExtensionsQuestion().getAnswer();
		return this;
	}

	public async scan(): Promise<void> {
		const dirName = await new DirectoryQuestion().getAnswer();

		let shouldScan = true;

		if (this.scannedDirs.includes(dirName)) {
			shouldScan = await new ConfirmScannedDirQuestion().getAnswer();
		}

		if (shouldScan) {
			this.scannedDirs.push(dirName);
			this.scanDir(dirName);
		}

		const scanAnotherDir = await new ConfirmDirectoryQuestion().getAnswer();

		if (scanAnotherDir) {
			return this.scan();
		}

		const duplicates = this.getDuplicates(this.store);

		if (!duplicates.length) {
			console.log('No duplicates where found.');
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
		return store.getAll().filter((value) => value.count > 1);
	}
}
