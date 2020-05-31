import { Store } from './store';
import { resolve } from 'path';

afterEach(() => {
	Store.clear();
});

describe('Store', () => {
	it('should add a value', () => {
		// arrange
		Store.add('dummy', { example: 'example' });

		// act
		const result = Store.getAll();

		// assert
		expect(result).toEqual([['dummy', { example: 'example' }]]);
	});

	it('should add two values', () => {
		// arrange
		Store.add('dummy1', { example: 'example1' });
		Store.add('dummy2', { example: 'example2' });

		// act
		const result = Store.getAll();

		// assert
		expect(result).toEqual([
			['dummy1', { example: 'example1' }],
			['dummy2', { example: 'example2' }],
		]);
	});

	it('should find a value', () => {
		// arrange
		Store.add('dummy1', { example: 'example1' });
		Store.add('dummy2', { example: 'example2' });

		// act
		const result = Store.find('dummy2');

		// assert
		expect(result).toEqual({ example: 'example2' });
	});

	it('should clear all values', () => {
		// arrange
		Store.add('dummy1', { example: 'example1' });
		Store.add('dummy2', { example: 'example2' });

		// act
		Store.clear();

		// assert
		expect(Store.getAll()).toEqual([]);
	});

	it('should throw an error when the key already exists', () => {
		// arrange
		Store.add('dummy1', { example: 'example1' });

		// act
		const result = () => Store.add('dummy1', { example: 'example2' });

		// assert
		expect(() => result()).toThrowError('Key dummy1 already exists');
	});

	it("should throw an error when updating a key that doesn't exist", () => {
		// act
		const result = () => Store.update('dummy1', { example: 'example2' });

		// assert
		expect(() => result()).toThrowError('Key dummy1 does not exist');
	});
});
