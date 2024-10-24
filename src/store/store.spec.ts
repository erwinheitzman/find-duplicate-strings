import { Store } from './store';

const dummy = { key: 'someStringMatch', count: 0, files: [] };

describe('Store', () => {
	beforeEach(() => {
		Store.clear();
	});

	it('should add a value', () => {
		Store.add('dummy1', dummy);

		expect(Store.getAll()).toEqual([dummy]);
	});

	it('should add two values', () => {
		Store.add('dummy1', dummy);
		Store.add('dummy2', dummy);

		expect(Store.getAll()).toEqual([dummy, dummy]);
	});

	it('should update a value', () => {
		Store.add('dummy1', dummy);
		Store.update('dummy1', { ...dummy, count: 3 });

		expect(Store.getAll()).toEqual([{ ...dummy, count: 3 }]);
	});

	it('should find value by key', () => {
		Store.add('dummy1', { ...dummy, key: 'foo' });
		Store.add('dummy2', dummy);

		expect(Store.find('dummy2')).toEqual(dummy);
	});

	it('should return null when the key is not found', () => {
		expect(Store.find('dummy2')).toEqual(null);
	});

	it('should throw an error when adding a key that already exists', () => {
		Store.add('dummy1', dummy);

		expect(() => Store.add('dummy1', dummy)).toThrow('Key dummy1 already exists');
	});

	it("should throw an error when updating a key that doesn't exist", () => {
		expect(() => Store.update('dummy1', dummy)).toThrow('Key dummy1 does not exist');
	});
});
