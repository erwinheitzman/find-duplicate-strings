import { deepEqual } from "node:assert";
import { dirname, resolve } from "node:path";
import { beforeEach, suite, test } from "node:test";
import { fileURLToPath } from "node:url";

import { store } from "../store/store.js";
import { File } from "./file.js";

suite("File", () => {
	beforeEach(() => {
		store.clear();
	});

	test("should add and update matches to store", async () => {
		const path1 = resolve(
			dirname(fileURLToPath(import.meta.url)),
			"./mocks/file1.js",
		);
		const path2 = resolve(
			dirname(fileURLToPath(import.meta.url)),
			"./mocks/file2.js",
		);

		await new File(path1).processContent();

		deepEqual(store.getAll(), [
			{
				count: 1,
				files: [path1],
				key: "foo",
			},
			{
				count: 1,
				files: [path1],
				key: "bar",
			},
		]);

		await new File(path2).processContent();

		deepEqual(store.getAll(), [
			{
				count: 4,
				files: [path1, path2],
				key: "foo",
			},
			{
				count: 1,
				files: [path1],
				key: "bar",
			},
		]);
	});

	test("should not store empty string values", async () => {
		const path = resolve(
			dirname(fileURLToPath(import.meta.url)),
			"./mocks/empty-strings-file.js",
		);

		await new File(path).processContent();

		deepEqual(store.getAll(), []);
	});

	test("should not store the same path path twice", async () => {
		const path = resolve(
			dirname(fileURLToPath(import.meta.url)),
			"./mocks/file2.js",
		);

		await new File(path).processContent();

		deepEqual(store.getAll(), [
			{
				count: 3,
				files: [path],
				key: "foo",
			},
		]);
	});

	test("should store all matches", async () => {
		const path = resolve(
			dirname(fileURLToPath(import.meta.url)),
			"./mocks/file3.js",
		);

		await new File(path).processContent();

		deepEqual(store.getAll(), [
			{
				count: 2,
				files: [path],
				key: "foo",
			},
			{
				count: 1,
				files: [path],
				key: "f'o''o'bar",
			},
			{
				count: 1,
				files: [path],
				key: "bar",
			},
		]);
	});

	test("should not call the store when there are no strings/matches", async () => {
		const path = resolve(
			dirname(fileURLToPath(import.meta.url)),
			"./mocks/no-strings-file",
		);

		await new File(path).processContent();

		deepEqual(store.getAll(), []);
	});

	test("should not call the store when the file is empty", async () => {
		const path = resolve(
			dirname(fileURLToPath(import.meta.url)),
			"./mocks/empty-file",
		);

		await new File(path).processContent();

		deepEqual(store.getAll(), []);
	});
});
