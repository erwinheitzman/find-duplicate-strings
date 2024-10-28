export class Loader {
	private loaderTimer: NodeJS.Timer;
	private count = 0;

	constructor(loaderInterval: number) {
		process.on('SIGTERM', () => {
			this.destroy();
		});
		process.on('SIGINT', () => {
			this.destroy();
		});

		this.loaderTimer = setInterval(() => {
			this.count++;
			if (this.count > 10) {
				this.count = 0;
				this.clearLine();
				return;
			}

			process.stdout.write('.');
		}, loaderInterval);
	}

	destroy = () => {
		clearInterval(this.loaderTimer);
		process.removeAllListeners('SIGTERM');
		process.removeAllListeners('SIGINT');
		this.clearLine();
	};

	private clearLine() {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
	}
}
