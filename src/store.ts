export class Store<T> {
	private readonly store: Map<string, T> = new Map();

	public add(key: string, value: T): void {
		if (this.store.has(key)) {
			throw new Error(`Key ${key} already exists`);
		}

		this.store.set(key, value);
	}

	public update(key: string, value: T): void {
		if (!this.store.has(key)) {
			throw new Error(`Key ${key} does not exist`);
		}

		this.store.set(key, value);
	}

	public find(key: string): T | null {
		return this.store.get(key) || null;
	}

	public getAll(): T[] {
		return Array.from(this.store.values());
	}

	public clear(): void {
		this.store.clear();
	}
}
