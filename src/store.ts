export class Store {
	private static readonly store: Map<string, unknown> = new Map();

	public static add(key: string, value: unknown): void {
		if (this.store.has(key)) {
			throw new Error(`value ${key} already exists`);
		}

		this.store.set(key, value);
	}

	static update(key: string, value: unknown): void {
		if (!this.store.has(key)) {
			throw new Error(`value ${key} does not exist`);
		}

		this.store.set(key, value);
	}

	static find(key: string): unknown | null {
		return this.store.get(key) || null;
	}

	static getAll(): Array<[string, unknown]> {
		const result = [];
		const entries = this.store.entries();

		for (const entry of entries) {
			result.push(entry);
		}

		return result;
	}

	static clear(): void {
		this.store.clear();
	}
}
