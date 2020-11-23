/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Store } from './store';

describe('Store', () => {
	beforeEach(() => {
		Store['store'] = new Map();
	});

	it('should add a value', () => {
		// act
		Store.add('dummy', { example: 'example' });

		// assert
		expect(Store.getAll()).toEqual([{ example: 'example' }]);
	});

	it('should add two values', () => {
		// act
		Store.add('dummy1', { example: 'example1' });
		Store.add('dummy2', { example: 'example2' });

		// assert
		expect(Store.getAll()).toEqual([{ example: 'example1' }, { example: 'example2' }]);
	});

	it('should update a value', () => {
		// act
		Store.add('dummy', { example: 'example' });
		Store.update('dummy', { example: 'example1' });

		// assert
		expect(Store.getAll()).toEqual([{ example: 'example1' }]);
	});

	it('should find a value', () => {
		// act
		Store.add('dummy1', { example: 'example1' });
		Store.add('dummy2', { example: 'example2' });

		// assert
		expect(Store.find('dummy2')).toEqual({ example: 'example2' });
	});

	it('should return null when the item is not found', () => {
		// assert
		expect(Store.find('dummy2')).toEqual(null);
	});

	it('should throw an error when the key already exists', () => {
		// act
		Store.add('dummy1', { example: 'example1' });

		// assert
		expect(() => Store.add('dummy1', { example: 'example2' })).toThrowError('Key dummy1 already exists');
	});

	it("should throw an error when updating a key that doesn't exist", () => {
		// act and assert
		expect(() => Store.update('dummy1', { example: 'example2' })).toThrowError('Key dummy1 does not exist');
	});
});
