import { deepEqual } from "node:assert";
import { platform } from "node:os";
import { resolve } from "node:path";
import { beforeEach, mock, suite, test } from "node:test";

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

suite("Directory", () => {
	beforeEach(() => {
		mockExistsSync.mock.resetCalls();
	});

	test("should return files", async () => {
		mockGlobSync.mock.mockImplementation(() => ["file1", "file2"]);
		const files = getFiles("dummy-directory", []);

		deepEqual(files, ["file1", "file2"]);
	});

	test("should exclude file: file.log", async () => {
		mockGlobSync.mock.mockImplementation(() => ["file.log", "file"]);
		const files = getFiles("dummy-directory", ["file.log"]);

		deepEqual(files, ["file"]);
	});

	test("should exclude files from directory: node_modules", () => {
		mockGlobSync.mock.mockImplementation(() => [
			resolve("./foo/node_modules/file.log"),
			"file",
		]);
		const files = getFiles("dummy-directory", ["node_modules"]);

		deepEqual(files, ["file"]);
	});

	test("should return existing files only", () => {
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
