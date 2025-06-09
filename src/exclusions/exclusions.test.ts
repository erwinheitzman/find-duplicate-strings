import { deepEqual } from "node:assert";
import { suite, test } from "node:test";

import { Exclusions } from "./exclusions.js";

suite("Exclusions", () => {
	test("should split the answer on a comma", async () => {
		const result = Exclusions.process("dummy1,dummy2,dummy3");

		deepEqual(result, ["dummy1", "dummy2", "dummy3"]);
	});

	test("should trim values from the list", async () => {
		const result = Exclusions.process("  dummy1  ,  dummy2   ,  dummy3   ");

		deepEqual(result, ["dummy1", "dummy2", "dummy3"]);
	});

	test("should remove empty values from the list", async () => {
		const result = Exclusions.process(", ,dummy1,,dummy2,,dummy3, ,");

		deepEqual(result, ["dummy1", "dummy2", "dummy3"]);
	});
});
