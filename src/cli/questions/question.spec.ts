/* eslint @typescript-eslint/no-explicit-any: 0 */

import { Question } from './question';

jest.mock('inquirer');

describe('File', () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should have default type "input"', () => {
		// arrange & act
		// @ts-expect-error
		const question = new Question('foo', 'bar');

		expect(question['type']).toEqual('input');
	});

	it('should take the name and message parameters', () => {
		// arrange & act
		// @ts-expect-error
		const question = new Question('foo', 'bar');

		expect(question['name']).toEqual('foo');
		expect(question['message']).toEqual('bar');
	});

	it('should be possible to overwrite the type', () => {
		// arrange & act
		// @ts-expect-error
		const question = new Question('foo', 'bar', 'baz');

		// assert
		expect(question['type']).toEqual('baz');
	});
});
