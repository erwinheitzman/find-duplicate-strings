export class Extensions {
	private static removeDotPrefix(str: string): string {
		return str.startsWith('.') ? str.substring(1, str.length) : str;
	}

	public static process(extensions?: string): string[] {
		return (
			extensions
				?.split?.(',')
				.map((extension) => extension.trim())
				.filter((extension) => extension)
				.map(this.removeDotPrefix) || []
		);
	}
}
