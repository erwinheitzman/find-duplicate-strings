import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

export class Store {
	private static store: Map<string, unknown> = new Map();

	static create(): void {
		const path = join(__dirname, '.tmp');
		if (!existsSync(path)) {
			writeFileSync(path, '[]', { encoding: 'utf8' });
		}
	}

	static save(): void {
		const path = join(__dirname, '.tmp');
		const file = readFileSync(path, { encoding: 'utf8' });
		const newFile = JSON.parse(file);
		writeFileSync(path, JSON.stringify(newFile), { encoding: 'utf8' });
		this.clear();
	}

	static add(key: string, value: unknown): void {
		// const path = join(__dirname, '.tmp');
		// const file = readFileSync(path, { encoding: 'utf8' });
		// const newFile = JSON.parse(file);

		// if (newFile.some((i: unknown[]) => i[0] === key)) {
		// 	throw new Error(`Key ${key} already exists`);
		// }

		// newFile.push([key, value]);

		// writeFileSync(path, JSON.stringify(newFile), { encoding: 'utf8' });
		if (this.store.has(key)) {
			throw new Error(`Key ${key} already exists`);
		}

		this.store.set(key, value);
	}

	static update(key: string, value: unknown): void {
		// const path = join(__dirname, '.tmp');
		// const file = readFileSync(path, { encoding: 'utf8' });
		// const newFile = JSON.parse(file);

		// if (!newFile.some((i: unknown[]) => i[0] === key)) {
		// 	throw new Error(`Key ${key} does not exist`);
		// }

		// const index = newFile.flatMap(([a]: string[]) => a).indexOf(key);

		// newFile[index] = [key, value];

		// writeFileSync(path, JSON.stringify(newFile), { encoding: 'utf8' });
		if (!this.store.has(key)) {
			throw new Error(`Key ${key} does not exist`);
		}

		this.store.set(key, value);
	}

	static find(key: string): unknown | null {
		// const path = join(__dirname, '.tmp');
		// const file = readFileSync(path, { encoding: 'utf8' });
		// const newFile = JSON.parse(file);

		// const data = newFile.find((i: unknown[]) => i[0] === key);

		// return data ? data[1] : null;
		return this.store.get(key) || null;
	}

	static getAll(): unknown[] {
		// let data = [];

		// try {
		// 	const path = join(__dirname, '.tmp');
		// 	const file = readFileSync(path, { encoding: 'utf8' });
		// 	const newFile = JSON.parse(file);

		// 	data = newFile.map((i: unknown[]) => i[1]);
		// } catch (_) {
		// 	data = [];
		// }

		// return data;
		return Array.from(this.store.values());
	}

	static clear(): void {
		this.store = new Map();
		const path = join(__dirname, '.tmp');

		try {
			unlinkSync(path);
		} catch (_) {}
	}
}
