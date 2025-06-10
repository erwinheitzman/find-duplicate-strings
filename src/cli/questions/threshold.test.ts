import { equal } from "node:assert";
import { mock, suite, test } from "node:test";

const mockInput = mock.fn(() => "5");
mock.module("@inquirer/prompts", {
	namedExports: {
		input: mockInput,
	},
});

const { ThresholdQuestion } = await import("./threshold.js");

suite("ThresholdQuestion", () => {
	test("should return the answer when it is found", async () => {
		const question = new ThresholdQuestion();

		const answer = await question.getAnswer();

		equal(answer, "5");
	});
});
