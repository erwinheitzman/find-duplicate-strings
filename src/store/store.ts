import type { Finding } from "../typings/finding.js";

export class Store {
	static #store: Map<string, Finding> = new Map();

	static add(key: string, value: Finding): void {
		if (Store.#store.has(key)) {
			throw new Error(`Key ${key} already exists`);
		}

		Store.#store.set(key, value);
	}

	static find(key: string): Finding | null {
		return Store.#store.get(key) || null;
	}

	static getAll(): Finding[] {
		return Array.from(Store.#store.values());
	}

	static clear() {
		Store.#store = new Map();
	}
}
