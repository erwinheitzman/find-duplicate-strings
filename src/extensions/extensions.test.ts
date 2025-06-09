import { deepEqual } from "node:assert";
import { suite, test } from "node:test";

import { Extensions } from "./extensions.js";

suite("Extensions", () => {
	test("should split the answer on a comma", async () => {
		const result = Extensions.process("dummy1,dummy2,dummy3");

		deepEqual(result, ["dummy1", "dummy2", "dummy3"]);
	});

	test("should remove the dot prefixes", () => {
		const result = Extensions.process(".ts,.json,.spec.ts");

		deepEqual(result, ["ts", "json", "spec.ts"]);
	});

	test("should not remove anything when there's no dot prefix", () => {
		const result = Extensions.process("ts,json,spec.ts");

		deepEqual(result, ["ts", "json", "spec.ts"]);
	});

	test("should trim values from the list", async () => {
		const result = Extensions.process("  .ts  ,  .json   ,  .spec.ts   ");

		deepEqual(result, ["ts", "json", "spec.ts"]);
	});

	test("should remove empty values from the list", async () => {
		const result = Extensions.process(", ,.ts,,.json,,.spec.ts, ,");

		deepEqual(result, ["ts", "json", "spec.ts"]);
	});
});
