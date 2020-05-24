import { Scanner } from './scan';

const scanner = new Scanner();

describe('scanDir', () => {
	it('should retrieve all duplicates from ["js"] files', () => {
		expect(scanner.scanDir('data', ['js'])).toEqual({ bar: 6, foo: 6, unique: 2 });
	});

	it('should retrieve all duplicates from all ["ts"] files', () => {
		expect(scanner.scanDir('data', ['ts'])).toEqual({ bar: 4, foo: 4, unique: 4 });
	});

	it('should retrieve all duplicates from all ["json"] files', () => {
		expect(scanner.scanDir('data', ['json'])).toEqual({
			one: 2,
			bar: 4,
			two: 2,
			foo: 2,
			three: 2,
			four: 2,
			baz: 2,
			five: 2,
			unique: 2,
		});
	});

	it('should retrieve all duplicates from all ["js", "ts", "json"] files', () => {
		expect(scanner.scanDir('data', ['js', 'ts', 'json'])).toEqual({
			one: 2,
			bar: 14,
			two: 2,
			foo: 12,
			three: 2,
			four: 2,
			baz: 2,
			five: 2,
			unique: 8,
		});
	});

	it('should not return any matches for empty strings', () => {
		expect(scanner.scanDir('data/empty', ['js'])).toEqual({});
	});

	it('should not return any matches when no valid formats are passed', () => {
		expect(scanner.scanDir('data', [])).toEqual({});
	});

	it('should throw an error when the directory does not exist', () => {
		expect(() => scanner.scanDir('does-not-exist', [])).toThrowError(
			"no such file or directory, scandir 'does-not-exist'",
		);
	});
});
