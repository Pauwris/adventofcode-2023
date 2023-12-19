import * as fs from 'fs';

export class AdventOfCode  {
	#relativeFilePath: string;
	lines: string[] = [];

	constructor(dataSourceName: string, calibrate: boolean) {
		this.#relativeFilePath = `data/${dataSourceName}${calibrate ? "-calibration" : ""}.txt`;
		const fileContent = fs.readFileSync(this.#relativeFilePath, 'utf-8');
		this.lines = fileContent.split("\n").map(line => line.replace(/\r/g,''));
	}

	printSum(sum: number) {
		console.log("================")
		console.log(sum);
	}
}

export function mathAdd(accumulator: number, a: number) {
	return accumulator + a;
}
