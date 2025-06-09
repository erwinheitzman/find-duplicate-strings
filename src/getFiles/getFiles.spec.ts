import { deepEqual } from "node:assert";
import { beforeEach, describe, it, mock } from "node:test";

const mockGlobSync = mock.fn((): string[] => []);
const mockExistsSync = mock.fn(() => true);

mock.module("glob", {
	namedExports: {
		globSync: mockGlobSync,
	},
});
mock.module("node:fs", {
	namedExports: {
		existsSync: mockExistsSync,
	},
});

const { getFiles } = await import("./getFiles.js");

describe("Directory", () => {
	beforeEach(() => {
		mockExistsSync.mock.resetCalls();
	});

	it("should return files", async () => {
		mockGlobSync.mock.mockImplementation(() => ["file1", "file2"]);
		const files = getFiles("dummy-directory", []);

		deepEqual(files, ["file1", "file2"]);
	});

	it("should exclude file: file.log", async () => {
		mockGlobSync.mock.mockImplementation(() => ["file.log", "file"]);
		const files = getFiles("dummy-directory", ["file.log"]);

		deepEqual(files, ["file"]);
	});

	it("should exclude files from directory: node_modules", () => {
		mockGlobSync.mock.mockImplementation(() => [
			"./foo/node_modules/file.log",
			"file",
		]);
		const files = getFiles("dummy-directory", ["node_modules"]);

		deepEqual(files, ["file"]);
	});

	it("should return existing files only", () => {
		mockExistsSync.mock.mockImplementationOnce(() => false, 0);
		mockExistsSync.mock.mockImplementationOnce(() => true, 1);
		mockExistsSync.mock.mockImplementationOnce(() => false, 2);
		mockExistsSync.mock.mockImplementationOnce(() => true, 3);
		mockGlobSync.mock.mockImplementation(() => [
			"file1.ts",
			"file2",
			"file3.ts",
			"file4.log",
		]);
		const files = getFiles("dummy-directory", []);

		deepEqual(files, ["file2", "file4.log"]);
	});
});
