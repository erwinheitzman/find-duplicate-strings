export class Store {
	private static store: Map<string, unknown> = new Map();

	static add(key: string, value: unknown): void {
		if (this.store.has(key)) {
			throw new Error(`Key ${key} already exists`);
		}

		this.store.set(key, value);
	}

	static update(key: string, value: unknown): void {
		if (!this.store.has(key)) {
			throw new Error(`Key ${key} does not exist`);
		}

		this.store.set(key, value);
	}

	static find(key: string): unknown | null {
		return this.store.get(key) || null;
	}

	static getAll(): unknown[] {
		return Array.from(this.store.values());
	}
}
