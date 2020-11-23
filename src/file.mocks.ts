import { Readable } from 'stream';

const readStreamMock = jest.fn().mockImplementation(() => {
	const readable = new Readable();
	readable.push('hello');
	readable.push('world');
	readable.push(null);
	return readable;
});

const fileMock = jest.fn().mockImplementation(() => ({
	createReadStream: readStreamMock,
}));

export { readStreamMock, fileMock };
