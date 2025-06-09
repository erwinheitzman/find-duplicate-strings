import { equal } from "node:assert";
import { mock, suite, test } from "node:test";

const mockInput = mock.fn(() => "dummy");
mock.module("@inquirer/prompts", {
	namedExports: {
		input: mockInput,
	},
});

const { input } = await import("@inquirer/prompts");

const { ExclusionsQuestion } = await import("./exclusions.js");

suite("ExclusionsQuestion", () => {
	test("should return the answer when it is found", async () => {
		const question = new ExclusionsQuestion();

		const answer = await question.getAnswer();

		equal(answer, "dummy");
	});
});
