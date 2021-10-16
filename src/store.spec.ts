import { Store } from './store';

describe('Store', () => {
	beforeEach(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		Store['store'] = new Map();
	});

	it('should add a value', () => {
		Store.add('dummy', { example: 'example' });

		expect(Store.getAll()).toEqual([{ example: 'example' }]);
	});

	it('should add two values', () => {
		Store.add('dummy1', { example: 'example1' });
		Store.add('dummy2', { example: 'example2' });

		expect(Store.getAll()).toEqual([{ example: 'example1' }, { example: 'example2' }]);
	});

	it('should update a value', () => {
		Store.add('dummy', { example: 'example' });
		Store.update('dummy', { example: 'example1' });

		expect(Store.getAll()).toEqual([{ example: 'example1' }]);
	});

	it('should find a value', () => {
		Store.add('dummy1', { example: 'example1' });
		Store.add('dummy2', { example: 'example2' });

		expect(Store.find('dummy2')).toEqual({ example: 'example2' });
	});

	it('should return null when the item is not found', () => {
		expect(Store.find('dummy2')).toEqual(null);
	});

	it('should throw an error when the key already exists', () => {
		Store.add('dummy1', { example: 'example1' });

		expect(() => Store.add('dummy1', { example: 'example2' })).toThrowError('Key dummy1 already exists');
	});

	it("should throw an error when updating a key that doesn't exist", () => {
		expect(() => Store.update('dummy1', { example: 'example2' })).toThrowError('Key dummy1 does not exist');
	});
});
