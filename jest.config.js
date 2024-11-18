/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	testEnvironment: 'node',
	transform: {
		'^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: './tsconfig.test.json', useESM: true }],
	},
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov'],
	coverageThreshold: {
		global: {
			branches: 95,
			functions: 95,
			lines: 95,
			statements: 95,
		},
	},
	resetMocks: true,
	restoreMocks: true,
};
