export class Extensions {
	private static removeDotPrefix(str: string): string {
		if (str.startsWith('.')) {
			return str.substr(1, str.length);
		}
		return str;
	}

	public static process(extensions: string): string[] {
		return extensions
			.split(',')
			.map((extension) => extension.trim())
			.filter((extension) => extension)
			.map(this.removeDotPrefix);
	}
}
