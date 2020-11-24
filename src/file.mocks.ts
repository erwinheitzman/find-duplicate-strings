import { Readable } from 'stream';

export const file1 = (): Readable => {
	const readable = new Readable({ encoding: 'utf8' });
	readable.push(`describe('', () => {`);
	readable.push(`    it("", () => {`);
	readable.push(`        const foo = "foo";`);
	readable.push(`        const bar = 'bar';`);
	readable.push(`        const baz = \`baz\`;`);
	readable.push(`    });`);
	readable.push(`});`);
	readable.push(null);
	return readable;
};

export const file2 = (): Readable => {
	const readable = new Readable({ encoding: 'utf8' });
	readable.push(`describe('', () => {`);
	readable.push(`    it("", () => {`);
	readable.push(`    });`);
	readable.push(`});`);
	readable.push(null);
	return readable;
};

export const file3 = (): Readable => {
	const readable = new Readable({ encoding: 'utf8' });
	readable.push(`describe('', () => {`);
	readable.push(`    it("", () => {`);
	readable.push(`        let foo = "foo";`);
	readable.push(`        foo = "foo";`);
	readable.push(`        foo = "foo";`);
	readable.push(`    });`);
	readable.push(`});`);
	readable.push(null);
	return readable;
};

export const file4 = (): Readable => {
	const readable = new Readable({ encoding: 'utf8' });
	readable.push(`const foo = "foo";`);
	readable.push(``);
	readable.push(`describe('', () => {`);
	readable.push(`    it("", () => {`);
	readable.push(`        const foo = "foo";`);
	readable.push(`        const bar = 'bar';`);
	readable.push(`        const baz = \`baz\`;`);
	readable.push(`    });`);
	readable.push(`});`);
	readable.push(null);
	return readable;
};
