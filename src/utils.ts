import * as fs from 'fs';

export class AdventOfCode  {
	#inputPath: string;
	#outputPath: string;
	fileContent: string;
	startTime: Date;
	lines: string[] = [];

	constructor(dataSourceName: string, calibrate: boolean) {
		this.startTime = new Date();
		this.#inputPath = `data/${dataSourceName}${calibrate ? "-calibration" : ""}.txt`;
		this.#outputPath = `output/${dataSourceName}${calibrate ? "-calibration" : ""}.txt`;

		this.fileContent = fs.readFileSync(this.#inputPath, 'utf-8');
		this.lines = this.fileContent.split("\n").map(line => line.replace(/\r/g,''));
	}

	get elapsedMilliseconds() {
		return new Date().getTime() - this.startTime.getTime();
	}

	printSum(sum: number) {
		console.log(`=== Processing time (${this.elapsedMilliseconds} ms)  ===`)
		console.log(sum);
	}

	writeOutput(output: string, fileName?: string) {
		fs.writeFileSync(fileName ? fileName : this.#outputPath, output, 'utf-8');
	}
}

export function mathAdd(accumulator: number, a: number) {
	return accumulator + a;
}
