/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Extensions } from './extensions';

describe('Extensions', () => {
	it('should split the answer on a comma', async () => {
		// act
		const result = Extensions.process('dummy1,dummy2,dummy3');

		// assert
		expect(result).toEqual(['dummy1', 'dummy2', 'dummy3']);
	});

	it('should remove the dot prefixes', () => {
		// act
		const result = Extensions.process('.ts,.json,.spec.ts');

		// assert
		expect(result).toEqual(['ts', 'json', 'spec.ts']);
	});

	it("should not remove anything when there's no dot prefix", () => {
		// act
		const result = Extensions.process('ts,json,spec.ts');

		// assert
		expect(result).toEqual(['ts', 'json', 'spec.ts']);
	});

	it('should trim values from the list', async () => {
		// act
		const result = Extensions.process('  .ts  ,  .json   ,  .spec.ts   ');

		// assert
		expect(result).toEqual(['ts', 'json', 'spec.ts']);
	});

	it('should remove empty values from the list', async () => {
		// act
		const result = Extensions.process(', ,.ts,,.json,,.spec.ts, ,');

		// assert
		expect(result).toEqual(['ts', 'json', 'spec.ts']);
	});
});
