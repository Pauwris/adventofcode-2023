import * as fs from 'fs';

export class AdventOfCode  {
	#inputPath: string;
	#outputPath: string;
	lines: string[] = [];

	constructor(dataSourceName: string, calibrate: boolean) {
		this.#inputPath = `data/${dataSourceName}${calibrate ? "-calibration" : ""}.txt`;
		this.#outputPath = `output/${dataSourceName}${calibrate ? "-calibration" : ""}.txt`;

		const fileContent = fs.readFileSync(this.#inputPath, 'utf-8');
		this.lines = fileContent.split("\n").map(line => line.replace(/\r/g,''));
	}

	printSum(sum: number) {
		console.log("================")
		console.log(sum);
	}

	writeOutput(output: string) {
		fs.writeFileSync(this.#outputPath, output, 'utf-8');
	}
}

export function mathAdd(accumulator: number, a: number) {
	return accumulator + a;
}
