import { expect, jest, describe, it } from '@jest/globals';
import { Loader } from './loader.js';

process.stdout.clearLine = jest.fn() as jest.Mock<() => boolean>;
process.stdout.cursorTo = jest.fn() as jest.Mock<() => boolean>;
process.stdout.write = jest.fn() as jest.Mock<() => boolean>;

jest.useFakeTimers();

describe('Loader', () => {
	let loader: Loader;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		loader.destroy();
	});

	it('should not log anything when the interval has not occured yet', async () => {
		loader = new Loader(15);

		expect(process.stdout.write).not.toHaveBeenCalled();

		jest.advanceTimersByTime(5);

		expect(process.stdout.write).not.toHaveBeenCalled();
	});

	it('should log one dot for each interval', async () => {
		loader = new Loader(15);

		expect(process.stdout.write).not.toHaveBeenCalled();

		jest.advanceTimersByTime(40);

		expect(process.stdout.write).toHaveBeenCalledTimes(2);
	});

	it('should clear the line each time it reaches 10 dots', async () => {
		loader = new Loader(15);

		expect(process.stdout.write).not.toHaveBeenCalled();

		jest.advanceTimersByTime(400);

		expect(process.stdout.write).toHaveBeenCalledTimes(24);
		expect(process.stdout.clearLine).toHaveBeenCalledTimes(2);
		expect(process.stdout.cursorTo).toHaveBeenCalledTimes(2);
	});

	it('should clear the interval and remove all listeners when destroyed', async () => {
		loader = new Loader(15);

		const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
		const removeAllListenersSpy = jest.spyOn(process, 'removeAllListeners');
		loader['clearLine'] = jest.fn();

		loader.destroy();

		expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
		expect(removeAllListenersSpy).toHaveBeenCalledTimes(2);
		expect(loader['clearLine']).toHaveBeenCalledTimes(1);
	});

	it('should destroy when the process is terminated', async () => {
		const processEvents: { [key: string]: () => void } = {};
		process.on = jest.fn((signal: string, cb: () => void) => {
			processEvents[signal] = cb;
			return process;
		});
		process.kill = jest.fn((_pid: number, signal: keyof typeof processEvents): true => {
			processEvents[signal]();
			return true;
		});
		loader = new Loader(15);
		const destroySpy = jest.spyOn(loader, 'destroy');

		process.kill(process.pid, 'SIGTERM');

		expect(destroySpy).toHaveBeenCalledTimes(1);
	});

	it('should destroy when the user presses CTRL/CMD + C to end the program', async () => {
		const processEvents: { [key: string]: () => void } = {};
		process.on = jest.fn((signal: string, cb: () => void) => {
			processEvents[signal] = cb;
			return process;
		});
		process.kill = jest.fn((_pid: number, signal: keyof typeof processEvents): true => {
			processEvents[signal]();
			return true;
		});
		loader = new Loader(15);
		const destroySpy = jest.spyOn(loader, 'destroy');

		process.kill(process.pid, 'SIGINT');

		expect(destroySpy).toHaveBeenCalledTimes(1);
	});
});
