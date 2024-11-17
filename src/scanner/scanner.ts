import { getFiles } from '../getFiles/getFiles.js';
import { File } from '../file/file.js';
import { Output } from '../output/output.js';
import { Store } from '../store/store.js';
import { Loader } from '../loader/loader.js';
import { Exclusions } from '../exclusions/exclusions.js';
import { Extensions } from '../extensions/extensions.js';
import { ExclusionsQuestion } from '../cli/questions/exclusions.js';
import { ExtensionsQuestion } from '../cli/questions/extensions.js';
import { ThresholdQuestion } from '../cli/questions/threshold.js';

import type { Finding } from '../typings/finding.js';

interface Options {
	exclusions?: string;
	extensions?: string;
	output?: string;
	interactive?: boolean;
	path: string;
	threshold?: string;
}

export class Scanner {
	private exclusions!: string[];
	private extensions!: string[];
	private threshold!: number;
	private output!: string;
	private interactive!: boolean;
	private path: string;

	public constructor(
		private options: Options,
		private loaderInterval: number = 1000,
	) {
		this.exclusions = Exclusions.process(options.exclusions);
		this.extensions = Extensions.process(options.extensions);
		this.threshold = typeof options.threshold === 'string' ? parseInt(options.threshold, 10) : 1;
		this.output = options.output ?? 'fds-output';
		this.interactive = options.interactive ?? false;
		this.path = options.path;
	}

	public async scan(): Promise<void> {
		if (!this.options.exclusions && this.interactive) {
			const answer = await new ExclusionsQuestion().getAnswer();
			this.exclusions = Exclusions.process(answer);
		}

		if (!this.options.extensions && this.interactive) {
			const answer = await new ExtensionsQuestion().getAnswer();
			this.extensions = Extensions.process(answer);
		}

		if (!this.options.threshold && this.interactive) {
			const answer = await new ThresholdQuestion().getAnswer();
			this.threshold = parseInt(answer, 10);
		}

		await this.initScan();

		const duplicates = this.getDuplicates();

		if (!duplicates.length) {
			console.log('No duplicates where found.');
			return;
		}

		new Output(duplicates, this.output).output();
	}

	private async scanDir() {
		const files = getFiles(this.path, this.exclusions, this.extensions);
		const shard = `${files.length}`.length;
		const chunkSize = Math.ceil(files.length / shard);
		for (let i = 0; i < shard; i++) {
			await Promise.allSettled(files.splice(i, chunkSize).map((path) => this.scanFile(path)));
		}
	}

	private scanFile(path: string): Promise<void> {
		return new File(path).processContent();
	}

	private getDuplicates(): Finding[] {
		return Store.getAll().filter((value) => value.count > this.threshold);
	}

	private async initScan() {
		const loader = new Loader(this.loaderInterval);
		await this.scanDir();
		loader.destroy();
	}
}
