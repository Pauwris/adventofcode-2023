import * as fs from 'fs';

const bagLoad = {
	"red": 12,
	"green": 13,
	"blue": 14
}

function main() {
	const filePath = 'data/day2-calibration.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const lines = fileContent.split('\n');

	lines.forEach((line: string) => {
		const b = new BallsInBagGame(line);
		console.log(b.toString());
	})
}

class BallsInBagGame {
	record: string;

	constructor(record: string) {
		this.record = record;
	}
	toString() {
		return this.record;
	}
}

main();