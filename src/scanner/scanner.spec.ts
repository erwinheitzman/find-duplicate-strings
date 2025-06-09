import { describe, expect, it, jest } from "@jest/globals";

const mockGetExclusionsAnswer = jest.fn();
const mockGetThresholdAnswer = jest.fn();
const mockProcessContent = jest.fn();
const mockOutput = jest.fn();

jest.unstable_mockModule("../getFiles/getFiles.js", () => ({
	getFiles: jest.fn(),
}));
jest.unstable_mockModule("../store/store.js", () => ({
	Store: { getAll: jest.fn() },
}));
jest.unstable_mockModule("../cli/questions/exclusions.js", () => ({
	ExclusionsQuestion: () => ({ getAnswer: mockGetExclusionsAnswer }),
}));
jest.unstable_mockModule("../cli/questions/threshold.js", () => ({
	ThresholdQuestion: () => ({
		getAnswer: mockGetThresholdAnswer,
	}),
}));
jest.unstable_mockModule("../file/file.js", () => ({
	File: () => ({
		processContent: mockProcessContent,
	}),
}));
jest.unstable_mockModule("../output/output.js", () => ({
	Output: () => ({
		output: mockOutput,
	}),
}));

const { Scanner } = await import("./scanner.js");
const { getFiles } = await import("../getFiles/getFiles.js");
const { Store } = await import("../store/store.js");

console.log = jest.fn();
process.stdout.clearLine = jest.fn() as jest.Mock<() => boolean>;
process.stdout.cursorTo = jest.fn() as jest.Mock<() => boolean>;
process.stdout.write = jest.fn() as jest.Mock<() => boolean>;

const interval = 1;

jest.useFakeTimers();

describe("Scanner", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(process, "exit").mockImplementation(() => undefined as never);
		jest.mocked(getFiles).mockReturnValue([]);
		jest
			.mocked(Store.getAll)
			.mockReturnValue([{ count: 1, files: [], key: "" }]);
		mockGetExclusionsAnswer.mockReturnValue(Promise.resolve("dummy-dir"));
		mockGetThresholdAnswer.mockReturnValue(Promise.resolve("1"));
	});

	it("should enable interactive mode", async () => {
		const scanner = new Scanner({ interactive: true, path: "." }, interval);

		expect(scanner["interactive"]).toEqual(true);
	});

	it("should disable interactive mode", async () => {
		const scanner = new Scanner({ interactive: false, path: "." }, interval);

		expect(scanner["interactive"]).toEqual(false);
	});

	it("should set ignore", async () => {
		const scanner = new Scanner(
			{ ignore: "one,two,three", path: "." },
			interval,
		);

		expect(scanner["ignore"]).toEqual(["one", "two", "three"]);
	});

	it("should ask a question when ignore is not provided while interactive mode is enabled and the path does not point to a file", async () => {
		const scanner = new Scanner({ interactive: true, path: "." }, interval);

		await scanner.scan();

		expect(mockGetExclusionsAnswer).toHaveBeenCalledTimes(1);
	});

	it("should not ask a question when ignore is not provided while interactive mode is disabled and the path does not point to a file", async () => {
		const scanner = new Scanner({ path: "." }, interval);

		await scanner.scan();

		expect(mockGetExclusionsAnswer).not.toHaveBeenCalled();
	});

	it("should set a threshold when passing threshold as a string", async () => {
		jest
			.mocked(Store.getAll)
			.mockReturnValue([{ count: 5, files: [], key: "" }]);
		const scanner = new Scanner({ threshold: "3.55", path: "." }, interval);

		await scanner.scan();

		expect(scanner["threshold"]).toEqual(3);
	});

	it("should ask a question when the threshold is not provided and interactive mode is enabled", async () => {
		const scanner = new Scanner({ interactive: true, path: "." }, interval);

		await scanner.scan();

		expect(mockGetThresholdAnswer).toHaveBeenCalledTimes(1);
	});

	it("should not ask a question when the threshold is not provided and interactive mode is disabled", async () => {
		const scanner = new Scanner({ path: "." }, interval);

		await scanner.scan();

		expect(mockGetThresholdAnswer).not.toHaveBeenCalled();
	});

	it("should scan all files found in the directory", async () => {
		jest.mocked(getFiles).mockReturnValue(["", "", "", ""]);
		const scanner = new Scanner({ path: "" }, interval);

		await scanner.scan();

		expect(mockProcessContent).toHaveBeenCalledTimes(4);
	});

	it("should scan the single file that is passed", async () => {
		jest.mocked(getFiles).mockReturnValue([""]);
		const scanner = new Scanner({ path: "" }, interval);

		await scanner.scan();

		expect(mockProcessContent).toHaveBeenCalledTimes(1);
	});

	it("should log a message to the console when no results are found", async () => {
		jest.mocked(Store.getAll).mockReturnValue([]);
		const scanner = new Scanner({ path: "." }, interval);

		await scanner.scan();

		expect(console.log).toHaveBeenCalledWith("No duplicates where found.");
	});

	it("should not trigger an output when no results are found", async () => {
		jest.mocked(Store.getAll).mockReturnValue([]);
		const scanner = new Scanner({ path: "." }, interval);

		await scanner.scan();

		expect(mockOutput).not.toHaveBeenCalled();
	});

	it("should log a message to the console when results are found but the counts are lower then the threshold", async () => {
		jest
			.mocked(Store.getAll)
			.mockReturnValue([{ count: 0, files: [], key: "" }]);
		const scanner = new Scanner({ path: "." }, interval);

		await scanner.scan();

		expect(console.log).toHaveBeenCalledWith("No duplicates where found.");
	});

	it("should not trigger an output when results are found but the counts are lower then the threshold", async () => {
		jest
			.mocked(Store.getAll)
			.mockReturnValue([{ count: 0, files: [], key: "" }]);
		const scanner = new Scanner({ path: "." }, interval);

		await scanner.scan();

		expect(mockOutput).not.toHaveBeenCalled();
	});

	it("should log a message to the console when results are found but the counts are equal to the threshold", async () => {
		jest
			.mocked(Store.getAll)
			.mockReturnValue([{ count: 1, files: [], key: "" }]);
		const scanner = new Scanner({ path: "." }, interval);

		await scanner.scan();

		expect(console.log).toHaveBeenCalledWith("No duplicates where found.");
	});

	it("should not trigger an output when results are found but the counts are equal to the threshold", async () => {
		jest
			.mocked(Store.getAll)
			.mockReturnValue([{ count: 1, files: [], key: "" }]);
		const scanner = new Scanner({ path: "." }, interval);

		await scanner.scan();

		expect(mockOutput).not.toHaveBeenCalled();
	});

	it("should not log a message to the console when duplicates are found and the counts are higher then the threshold", async () => {
		jest
			.mocked(Store.getAll)
			.mockReturnValue([{ count: 2, files: [], key: "" }]);
		const scanner = new Scanner({ path: "." }, interval);

		await scanner.scan();

		expect(console.log).not.toHaveBeenCalledTimes(1);
	});

	it("should trigger an output when duplicates are found and the counts are higher then the threshold", async () => {
		jest
			.mocked(Store.getAll)
			.mockReturnValue([{ count: 2, files: [], key: "" }]);
		const scanner = new Scanner({ path: "." }, interval);

		await scanner.scan();

		expect(mockOutput).toHaveBeenCalledTimes(1);
	});
});
