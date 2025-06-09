import { describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule("node:fs", () => ({
	existsSync: jest.fn(),
	writeFileSync: jest.fn(),
}));

const { resolve } = await import("node:path");
const { existsSync, writeFileSync } = await import("node:fs");
const { Output } = await import("./output.js");
const { findings, manyFindings } = await import("./output.mocks.js");

const expectedOutput = JSON.stringify(
	findings.sort((a, b) => b.count - a.count),
	null,
	2,
);

describe("Output", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should write with the expected content", async () => {
		const output = new Output(findings);

		output.output();

		expect((writeFileSync as jest.Mock).mock.calls[0][1]).toEqual(
			expectedOutput,
		);
	});

	it("should write with a custom file name", async () => {
		const output = new Output(findings, "foo-bar");

		output.output();

		expect(jest.mocked(writeFileSync).mock.calls[0][0]).toEqual(
			resolve(process.cwd(), "foo-bar.json"),
		);
	});

	it("should update the output name if it already exists", async () => {
		const output = new Output(findings);

		jest.mocked(existsSync).mockClear().mockReturnValue(false);
		output.output();
		expect(jest.mocked(writeFileSync).mock.calls[0][0]).toEqual(
			resolve(process.cwd(), "fds-output.json"),
		);

		jest
			.mocked(existsSync)
			.mockClear()
			.mockReturnValueOnce(true)
			.mockReturnValue(false);
		output.output();
		expect(jest.mocked(writeFileSync).mock.calls[1][0]).toEqual(
			resolve(process.cwd(), "fds-output-1.json"),
		);

		jest
			.mocked(existsSync)
			.mockClear()
			.mockReturnValueOnce(true)
			.mockReturnValue(false);
		output.output();
		expect(jest.mocked(writeFileSync).mock.calls[2][0]).toEqual(
			resolve(process.cwd(), "fds-output-2.json"),
		);

		jest
			.mocked(existsSync)
			.mockClear()
			.mockReturnValueOnce(true)
			.mockReturnValue(false);
		output.output();
		expect(jest.mocked(writeFileSync).mock.calls[3][0]).toEqual(
			resolve(process.cwd(), "fds-output-3.json"),
		);

		expect(writeFileSync).toHaveBeenCalledTimes(4);
	});

	it("should split the output in chucks when the output is too big", async () => {
		const sortedFindings = manyFindings(20).sort((a, b) => b.count - a.count);
		const findings1 = JSON.stringify(sortedFindings.slice(0, 10), null, 2);
		const findings2 = JSON.stringify(sortedFindings.slice(10, 20), null, 2);

		const output = new Output(manyFindings(20));

		jest.mocked(writeFileSync).mockImplementationOnce(() => {
			throw new Error("file too big error");
		});

		output.output();

		expect(writeFileSync).toHaveBeenCalledTimes(3);

		expect(jest.mocked(writeFileSync).mock.calls[1][1]).toEqual(findings1);
		expect(jest.mocked(writeFileSync).mock.calls[2][1]).toEqual(findings2);
	});

	it("should create two files when the findings do not exceed 99", async () => {
		const output = new Output(manyFindings(20));

		jest.mocked(writeFileSync).mockImplementationOnce(() => {
			throw new Error("file too big error");
		});

		output.output();

		expect(writeFileSync).toHaveBeenCalledTimes(3);

		expect(jest.mocked(writeFileSync).mock.calls[1][0]).toEqual(
			resolve(process.cwd(), "fds-output[0].json"),
		);
		expect(jest.mocked(writeFileSync).mock.calls[2][0]).toEqual(
			resolve(process.cwd(), "fds-output[1].json"),
		);
	});

	it("should create four files when the findings do not exceed 9999", async () => {
		const output = new Output(manyFindings(2000));

		jest.mocked(writeFileSync).mockImplementationOnce(() => {
			throw new Error("file too big error");
		});

		output.output();

		expect(writeFileSync).toHaveBeenCalledTimes(5);

		expect(jest.mocked(writeFileSync).mock.calls[1][0]).toEqual(
			resolve(process.cwd(), "fds-output[0].json"),
		);
		expect(jest.mocked(writeFileSync).mock.calls[2][0]).toEqual(
			resolve(process.cwd(), "fds-output[1].json"),
		);
		expect(jest.mocked(writeFileSync).mock.calls[3][0]).toEqual(
			resolve(process.cwd(), "fds-output[2].json"),
		);
		expect(jest.mocked(writeFileSync).mock.calls[4][0]).toEqual(
			resolve(process.cwd(), "fds-output[3].json"),
		);
	});
});
