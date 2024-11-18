import { expect, describe, it } from '@jest/globals';

import { Exclusions } from './exclusions.js';

describe('Exclusions', () => {
	it('should split the answer on a comma', async () => {
		const result = Exclusions.process('dummy1,dummy2,dummy3');

		expect(result).toEqual(['dummy1', 'dummy2', 'dummy3']);
	});

	it('should trim values from the list', async () => {
		const result = Exclusions.process('  dummy1  ,  dummy2   ,  dummy3   ');

		expect(result).toEqual(['dummy1', 'dummy2', 'dummy3']);
	});

	it('should remove empty values from the list', async () => {
		const result = Exclusions.process(', ,dummy1,,dummy2,,dummy3, ,');

		expect(result).toEqual(['dummy1', 'dummy2', 'dummy3']);
	});
});
