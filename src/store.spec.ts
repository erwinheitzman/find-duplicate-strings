import { Store } from './store';
import { resolve } from 'path';

const dataDir = resolve(__dirname, '..', 'data');

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
});
