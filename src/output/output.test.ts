import { deepEqual, equal } from "node:assert";
import { beforeEach, mock, suite, test } from "node:test";

const mockExistsSync = mock.fn(() => false);
const mockWriteFileSync = mock.fn();

mock.module("node:fs", {
	namedExports: {
		existsSync: mockExistsSync,
		writeFileSync: mockWriteFileSync,
	},
});

const { resolve } = await import("node:path");
const { Output } = await import("./output.js");
const { findings, manyFindings } = await import("./mocks/output.mocks.js");

const expectedOutput = JSON.stringify(
	findings.sort((a, b) => b.count - a.count),
	null,
	2,
);

suite("Output", () => {
	beforeEach(() => {
		mockExistsSync.mock.resetCalls();
		mockWriteFileSync.mock.resetCalls();
	});

	test("should write with the expected content", async () => {
		const output = new Output(findings);

		output.output();

		equal(mockWriteFileSync.mock.calls.at(0)?.arguments.at(1), expectedOutput);
	});

	test("should write with a custom file name", async () => {
		const output = new Output(findings, "foo-bar");

		output.output();

		equal(
			mockWriteFileSync.mock.calls.at(0)?.arguments.at(0),
			resolve(process.cwd(), "foo-bar.json"),
		);
	});

	test("should update the output name if it already exists", async () => {
		const output = new Output(findings);

		mockExistsSync.mock.mockImplementation(() => false);

		output.output();

		equal(
			mockWriteFileSync.mock.calls.at(0)?.arguments.at(0),
			resolve(process.cwd(), "fds-output.json"),
		);

		mockExistsSync.mock.resetCalls();
		mockExistsSync.mock.mockImplementationOnce(() => true, 0);

		output.output();

		equal(
			mockWriteFileSync.mock.calls.at(1)?.arguments.at(0),
			resolve(process.cwd(), "fds-output-1.json"),
		);

		mockExistsSync.mock.resetCalls();
		mockExistsSync.mock.mockImplementationOnce(() => true, 0);

		output.output();

		equal(
			mockWriteFileSync.mock.calls.at(2)?.arguments.at(0),
			resolve(process.cwd(), "fds-output-2.json"),
		);

		mockExistsSync.mock.resetCalls();
		mockExistsSync.mock.mockImplementationOnce(() => true, 0);

		output.output();

		equal(
			mockWriteFileSync.mock.calls.at(3)?.arguments.at(0),
			resolve(process.cwd(), "fds-output-3.json"),
		);

		equal(mockWriteFileSync.mock.callCount(), 4);
	});

	test("should split the output in two chucks when the output is too big and the number of results is > 9 and < 100", async () => {
		const input = manyFindings(20);
		const findings = JSON.parse(JSON.stringify(input)) as typeof input;
		const sortedFindings = findings.sort((a, b) => b.count - a.count);
		const findingsAsString = JSON.stringify(sortedFindings, null, 2);
		const findings1AsString = JSON.stringify(
			sortedFindings.slice(0, 10),
			null,
			2,
		);
		const findings2AsString = JSON.stringify(
			sortedFindings.slice(10, 20),
			null,
			2,
		);

		const output = new Output(input);

		mockWriteFileSync.mock.mockImplementationOnce(() => {
			throw new Error("file too big error");
		}, 0);

		output.output();

		equal(mockExistsSync.mock.callCount(), 1);
		equal(mockWriteFileSync.mock.callCount(), 3);

		deepEqual(mockWriteFileSync.mock.calls.at(0)?.arguments, [
			resolve(process.cwd(), "fds-output.json"),
			findingsAsString,
			{ encoding: "utf-8" },
		]);
		deepEqual(mockWriteFileSync.mock.calls.at(1)?.arguments, [
			resolve(process.cwd(), "fds-output[0].json"),
			findings1AsString,
			{ encoding: "utf-8" },
		]);
		deepEqual(mockWriteFileSync.mock.calls.at(2)?.arguments, [
			resolve(process.cwd(), "fds-output[1].json"),
			findings2AsString,
			{ encoding: "utf-8" },
		]);
	});

	test("should split the output in four chucks when the output is too big and the number of results is > 999 and < 10000", async () => {
		const input = manyFindings(2000);
		const findings = JSON.parse(JSON.stringify(input)) as typeof input;
		const sortedFindings = findings.sort((a, b) => b.count - a.count);
		const findingsAsString = JSON.stringify(sortedFindings, null, 2);
		const findings1AsString = JSON.stringify(
			sortedFindings.slice(0, 10),
			null,
			2,
		);
		const findings2AsString = JSON.stringify(
			sortedFindings.slice(10, 20),
			null,
			2,
		);

		const output = new Output(input);

		mockWriteFileSync.mock.mockImplementationOnce(() => {
			throw new Error("file too big error");
		}, 0);

		output.output();

		equal(mockExistsSync.mock.callCount(), 1);
		equal(mockWriteFileSync.mock.callCount(), 5);

		equal(
			mockWriteFileSync.mock.calls.at(1)?.arguments.at(0),
			resolve(process.cwd(), "fds-output[0].json"),
		);
		equal(
			mockWriteFileSync.mock.calls.at(2)?.arguments.at(0),
			resolve(process.cwd(), "fds-output[1].json"),
		);
		equal(
			mockWriteFileSync.mock.calls.at(3)?.arguments.at(0),
			resolve(process.cwd(), "fds-output[2].json"),
		);
		equal(
			mockWriteFileSync.mock.calls.at(4)?.arguments.at(0),
			resolve(process.cwd(), "fds-output[3].json"),
		);
	});
});
