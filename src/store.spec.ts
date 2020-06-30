import { Store } from './store';

describe('Store', () => {
	it('should add a value', () => {
		// arrange
		const store = new Store();

		// act
		store.add('dummy', { example: 'example' });

		// assert
		expect(store.getAll()).toEqual([{ example: 'example' }]);
	});

	it('should add two values', () => {
		// arrange
		const store = new Store();

		// act
		store.add('dummy1', { example: 'example1' });
		store.add('dummy2', { example: 'example2' });

		// assert
		expect(store.getAll()).toEqual([{ example: 'example1' }, { example: 'example2' }]);
	});

	it('should update a value', () => {
		// arrange
		const store = new Store();

		// act
		store.add('dummy', { example: 'example' });
		store.update('dummy', { example: 'example1' });

		// assert
		expect(store.getAll()).toEqual([{ example: 'example1' }]);
	});

	it('should find a value', () => {
		// arrange
		const store = new Store();

		// act
		store.add('dummy1', { example: 'example1' });
		store.add('dummy2', { example: 'example2' });

		// assert
		expect(store.find('dummy2')).toEqual({ example: 'example2' });
	});

	it('should return null when the item is not found', () => {
		// arrange
		const store = new Store();

		// assert
		expect(store.find('dummy2')).toEqual(null);
	});

	it('should clear all values', () => {
		// arrange
		const store = new Store();

		// act
		store.add('dummy1', { example: 'example1' });
		store.add('dummy2', { example: 'example2' });
		store.clear();

		// assert
		expect(store.getAll()).toEqual([]);
	});

	it('should throw an error when the key already exists', () => {
		// arrange
		const store = new Store();

		// act
		store.add('dummy1', { example: 'example1' });

		// assert
		expect(() => store.add('dummy1', { example: 'example2' })).toThrowError('Key dummy1 already exists');
	});

	it("should throw an error when updating a key that doesn't exist", () => {
		// arrange
		const store = new Store();

		// act and assert
		expect(() => store.update('dummy1', { example: 'example2' })).toThrowError('Key dummy1 does not exist');
	});
});
