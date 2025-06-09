import { ExclusionsQuestion } from "../cli/questions/exclusions.js";
import { ThresholdQuestion } from "../cli/questions/threshold.js";
import { Exclusions } from "../exclusions/exclusions.js";
import { File } from "../file/file.js";
import { getFiles } from "../getFiles/getFiles.js";
import { Loader } from "../loader/loader.js";
import { Output } from "../output/output.js";
import { store } from "../store/store.js";

import type { Finding } from "../typings/finding.js";

interface Options {
	ignore?: string;
	output?: string;
	interactive?: boolean;
	path: string;
	threshold?: string;
}

export class Scanner {
	private ignore!: string[];
	private threshold!: number;
	private output!: string;
	private interactive!: boolean;
	private path: string;

	public constructor(
		private options: Options,
		private loaderInterval = 1000,
	) {
		this.ignore = Exclusions.process(options.ignore);
		this.threshold =
			typeof options.threshold === "string"
				? Number.parseInt(options.threshold, 10)
				: 1;
		this.output = options.output ?? "fds-output";
		this.interactive = options.interactive ?? false;
		this.path = options.path;
	}

	public async scan(): Promise<void> {
		if (!this.options.ignore && this.interactive) {
			const answer = await new ExclusionsQuestion().getAnswer();
			this.ignore = Exclusions.process(answer);
		}

		if (!this.options.threshold && this.interactive) {
			const answer = await new ThresholdQuestion().getAnswer();
			this.threshold = Number.parseInt(answer, 10);
		}

		await this.initScan();

		const duplicates = this.getDuplicates();

		if (!duplicates.length) {
			console.log("No duplicates where found.");
			return;
		}

		new Output(duplicates, this.output).output();
	}

	private async scanDir() {
		const files = getFiles(this.path, this.ignore);
		const shard = `${files.length}`.length;
		const chunkSize = Math.ceil(files.length / shard);
		for (let i = 0; i < shard; i++) {
			await Promise.allSettled(
				files.splice(i, chunkSize).map((path) => this.scanFile(path)),
			);
		}
	}

	private scanFile(path: string): Promise<void> {
		return new File(path).processContent();
	}

	private getDuplicates(): Finding[] {
		return store.getAll().filter((value) => value.count > this.threshold);
	}

	private async initScan() {
		const loader = new Loader(this.loaderInterval);
		await this.scanDir();
		loader.destroy();
	}
}
