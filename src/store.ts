import { Finding } from './finding';

export class Store {
	private static readonly store: Map<string, Finding> = new Map();
	private static readonly filesCache: string[] = [];

	private static memoizedCache() {
		const cache: { [key: string]: string } = {};
		return (n: string): string | undefined => {
			if (n in cache) {
				return cache[n];
			}
			if (!this.filesCache.includes(n)) {
				this.filesCache.push(n);
			}

			const match = this.filesCache.find((i) => i === n);

			if (match) {
				cache[n] = match;
				return cache[n];
			}
		};
	}

	static cache = Store.memoizedCache();

	static add(key: string, value: Finding): void {
		if (this.store.has(key)) {
			throw new Error(`Key ${key} already exists`);
		}

		this.store.set(key, value);
	}

	static update(key: string, value: Finding): void {
		if (!this.store.has(key)) {
			throw new Error(`Key ${key} does not exist`);
		}

		this.store.set(key, value);
	}

	static find(key: string): Finding | null {
		return this.store.get(key) || null;
	}

	static getAll(): Finding[] {
		return Array.from(this.store.values());
	}
}
