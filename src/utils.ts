import * as fs from 'fs';

export class AdventOfCode  {
	#relativeFilePath: string;

	constructor(dataSourceName: string, calibrate: boolean) {
		this.#relativeFilePath = `data/${dataSourceName}${calibrate ? "-calibration" : ""}.txt`;
	}

	get lines(): string[] {
		const fileContent = fs.readFileSync(this.#relativeFilePath, 'utf-8');
		return fileContent.split("\n");
	}

	printSum(sum: number) {
		console.log("================")
		console.log(sum);
	}
}

