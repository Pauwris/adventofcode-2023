import * as fs from 'fs';

const SYMBOLS = ["#","$","%","&","*","+","-","/","=","@"];
const DIGITS = ["0","1","2","3","4","5","6","7","8","9"];
const DOT = ".";

class MatrixNumber {
	#matrix: string[] = []
	str: string = "";
	y: number = 0;
	xFrom: number = Infinity;
	xTo: number = -1;

	constructor(matrix:string[], y: number) {
		this.#matrix = matrix;
		this.y = y;
	}

	addDigit(chr: string, x: number) {
		this.str += chr;
		this.xFrom = this.xFrom < x ? this.xFrom : x;
		this.xTo = x > this.xTo ? x : this.xTo;
	}
	get value(): number {
		return parseInt(this.str, 10);
	}
	get isPartNumber(): boolean {
		for (let y=this.y - 1; y<=this.y + 1; y++) {
			for (let x=this.xFrom - 1; x<=this.xTo + 1; x++) {
				const row = this.#matrix[y];
				const chr = row && row[x];
				if (chr && SYMBOLS.includes(chr)) return true;
			}
		}
		return false;
	}
}

function sumNumbers(accumulator: number, a: number) {
  return accumulator + a;
}

function main() {
	const filePath = 'data/day3-calibration.txt';
	//const filePath = 'data/day3.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const matrix = fileContent.split('\n');

	const [firstRow] = matrix;
	const noCols = firstRow.length;
	const noRows = matrix.length;

	const matrixNumbers: MatrixNumber[] = [];
	for (let y=0; y<noRows; y++) {
		let mn;
		for (let x=0; x<noCols; x++) {
			const chr = matrix[y][x];
			if (DIGITS.includes(chr)) {
				mn = mn || new MatrixNumber(matrix, y);
				mn.addDigit(chr, x);
			} else if (mn) {
				matrixNumbers.push(mn)
				mn = null;
			}
		}
		if (mn) {
			matrixNumbers.push(mn)
			mn = null;
		}
	}

	const parts = matrixNumbers
	.filter(mn => mn.isPartNumber)
	.map(mn => mn.value)

	console.log(JSON.stringify(parts));

	const sum = parts.reduce(sumNumbers, 0)
	console.log(sum);
}

// answer 1: 506273 (wrong)
// answer 2: 507214

main();