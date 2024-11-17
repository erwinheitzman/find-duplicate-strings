import type { Finding } from '../typings/finding.js';

export class Store {
	static #store: Map<string, Finding> = new Map();

	static add(key: string, value: Finding): void {
		if (this.#store.has(key)) {
			throw new Error(`Key ${key} already exists`);
		}

		this.#store.set(key, value);
	}

	static find(key: string): Finding | null {
		return this.#store.get(key) || null;
	}

	static getAll(): Finding[] {
		return Array.from(this.#store.values());
	}

	static clear() {
		this.#store = new Map();
	}
}
