/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Exclusions } from './exclusions';

describe('Exclusions', () => {
	it('should split the answer on a comma', async () => {
		// act
		const result = Exclusions.process('dummy1,dummy2,dummy3');

		// assert
		expect(result).toEqual(['dummy1', 'dummy2', 'dummy3']);
	});

	it('should trim values from the list', async () => {
		// act
		const result = Exclusions.process('  dummy1  ,  dummy2   ,  dummy3   ');

		// assert
		expect(result).toEqual(['dummy1', 'dummy2', 'dummy3']);
	});

	it('should remove empty values from the list', async () => {
		// act
		const result = Exclusions.process(', ,dummy1,,dummy2,,dummy3, ,');

		// assert
		expect(result).toEqual(['dummy1', 'dummy2', 'dummy3']);
	});
});
