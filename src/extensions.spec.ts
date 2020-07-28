/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Extensions } from './extensions';

describe('Extensions', () => {
	it('should remove the dot prefix from the strings in a list', () => {
		// arange
		const extensions = new Extensions();

		// act
		const result = extensions.removeDotPrefix(['.ts', '.json', '.spec.ts']);

		// assert
		expect(result).toEqual(['ts', 'json', 'spec.ts']);
	});

	it('should remove empty values from the list', () => {
		// arange
		const extensions = new Extensions();

		// act
		const result = extensions.removeDotPrefix(['', '', 'ts']);

		// assert
		expect(result).toEqual(['ts']);
	});

	it('should not remove anything when theres no dot prefix', () => {
		// arange
		const extensions = new Extensions();

		// act
		const result = extensions.removeDotPrefix(['ts', 'json', 'spec.ts']);

		// assert
		expect(result).toEqual(['ts', 'json', 'spec.ts']);
	});
});
