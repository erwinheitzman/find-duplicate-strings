import { describe, expect, it } from "@jest/globals";

import { Extensions } from "./extensions.js";

describe("Extensions", () => {
	it("should split the answer on a comma", async () => {
		const result = Extensions.process("dummy1,dummy2,dummy3");

		expect(result).toEqual(["dummy1", "dummy2", "dummy3"]);
	});

	it("should remove the dot prefixes", () => {
		const result = Extensions.process(".ts,.json,.spec.ts");

		expect(result).toEqual(["ts", "json", "spec.ts"]);
	});

	it("should not remove anything when there's no dot prefix", () => {
		const result = Extensions.process("ts,json,spec.ts");

		expect(result).toEqual(["ts", "json", "spec.ts"]);
	});

	it("should trim values from the list", async () => {
		const result = Extensions.process("  .ts  ,  .json   ,  .spec.ts   ");

		expect(result).toEqual(["ts", "json", "spec.ts"]);
	});

	it("should remove empty values from the list", async () => {
		const result = Extensions.process(", ,.ts,,.json,,.spec.ts, ,");

		expect(result).toEqual(["ts", "json", "spec.ts"]);
	});
});
