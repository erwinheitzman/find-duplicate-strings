export class Exclusions {
	public static process(exclusions?: string): string[] {
		return (
			exclusions
				?.split?.(",")
				.map((exclusion) => exclusion.trim())
				.filter((exclusion) => exclusion) || []
		);
	}
}
