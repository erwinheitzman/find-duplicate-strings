import { scanDir } from './scan';

describe('scanDir', () => {
	it('should retrieve all duplicates', () => {
		expect(scanDir('data')).toEqual({
			bar: 6,
			foo: 6,
			unique: 2,
		});
	});

	it('should throw an error when the directory does not exist', () => {
		expect(() => scanDir('does-not-exist')).toThrowError('no such file or directory, scandir \'does-not-exist\'');
	});
});
