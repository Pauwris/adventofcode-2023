import { AdventOfCode, mathAdd } from './utils.js'

class PredictNextValue {
	sum: number = 0;
	#lines: number[][] = [];
	constructor(public hist: number[]) {
		this.#lines.push(hist);

		while (!this.#lastLineAllZero) {
			const nextLine: number[] = [];
			for (let i=0, l=this.#lastLine.length; i<l-1; i++) {
				nextLine.push(this.#lastLine[i+1] - this.#lastLine[i])
			}
			this.#lines.push(nextLine)
		}

		this.#lines.forEach(line => {
			const lastValue = line.pop();
			if (lastValue) {
				this.sum += lastValue;
			}
		})

		this.#lines = [];
	}
	get #lastLineAllZero():boolean {
		return this.#lastLine.every(n => n === 0)
	}
	get #lastLine(): number[] {
		return this.#lines[this.#lines.length - 1];
	}
}

function main() {
	const aoc = new AdventOfCode("day9", false);

	const histories = aoc.lines.map(line => new PredictNextValue(line.split(" ").map(item => parseInt(item, 10))))
	histories.forEach(hist => console.log(JSON.stringify(hist)));
	
	const sum: number = histories.map(pnv => pnv.sum).reduce(mathAdd, 0);
	aoc.printSum(sum);
}

main();