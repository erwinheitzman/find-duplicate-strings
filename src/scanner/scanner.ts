import { existsSync, statSync } from 'node:fs';
import { normalize, resolve } from 'node:path';
import process from 'node:process';

import { ExclusionsQuestion, ExtensionsQuestion, ThresholdQuestion } from '../cli/questions';
import { Directory } from '../directory/directory';
import { Exclusions } from '../exclusions/exclusions';
import { Extensions } from '../extensions/extensions';
import { File } from '../file/file';
import { Output } from '../output/output';
import { Store } from '../store/store';
import { Loader } from '../loader/loader';
import type { Finding } from '../typings/finding';

interface Options {
	exclusions?: string;
	extensions?: string;
	output?: string;
	interactive?: boolean;
	path: string;
	threshold?: number | string;
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
		this.path = normalize(resolve(process.cwd(), options.path));

		if (!existsSync(this.path)) {
			throw new Error('Invalid path: No such directory or file.');
		}
	}

	public async scan(): Promise<void> {
		const isDirectory = statSync(this.path).isDirectory();

		if (!this.options.exclusions && isDirectory && this.interactive) {
			const answer = await new ExclusionsQuestion().getAnswer();
			this.exclusions = Exclusions.process(answer);
		}

		if (!this.options.extensions && isDirectory && this.interactive) {
			const answer = await new ExtensionsQuestion().getAnswer();
			this.extensions = Extensions.process(answer);
		}

		if (!this.options.threshold && this.interactive) {
			const answer = await new ThresholdQuestion().getAnswer();
			this.threshold = parseInt(answer, 10);
		}

		await this.initScan(this.path);

		const duplicates = this.getDuplicates();

		if (!duplicates.length) {
			console.log('No duplicates where found.');
			return;
		}

		new Output(duplicates, this.output).output();
	}

	private async scanDir(path: string): Promise<PromiseSettledResult<void>[]> {
		const directory = new Directory(path, this.exclusions, this.extensions);
		const files = directory.getFiles();
		const promises = [];
		for await (const file of files) {
			promises.push(this.scanFile(file));
		}
		return Promise.allSettled(promises);
	}

	private scanFile(path: string): Promise<void> {
		return new File(path).processContent();
	}

	private getDuplicates(): Finding[] {
		return Store.getAll().filter((value) => value.count > this.threshold);
	}

	private async initScan(path: string) {
		const loader = new Loader(this.loaderInterval);
		const lstat = statSync(path);

		if (lstat.isFile()) {
			await new File(path).processContent();
		}

		if (lstat.isDirectory()) {
			await this.scanDir(path);
		}

		loader.destroy();
	}
}
