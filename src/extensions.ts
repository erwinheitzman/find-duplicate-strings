export class Extensions {
	public removeDotPrefix(extensions: string[]): string[] {
		return extensions
			.map((extension: string) => {
				if (extension.startsWith('.')) {
					return extension.substr(1, extension.length);
				}
				return extension;
			})
			.filter((extension: string) => extension);
	}
}
