import * as fs from 'fs';

class RangeDef {
	constructor(public destStart: number, public sourceStart: number, public rangeLength: number) {}

	sourceIndexOf(value: number):number {
		if (value > this.sourceStart + this.rangeLength) return -1;
		if (value < this.sourceStart) return -1;
		return value - this.sourceStart;
	}

	getDestinationValue(index: number):number {
		return this.destStart + index;
	}
}

class AlmanacMap {
	name: string = "";
	shortName: string = "";
	rangeDefinition: RangeDef[] = [];

	constructor(name: string) {
		this.name = name;
		this.shortName = name.split("-")[2];
	}

	findLowest(value: number) {
		const numbers: number[] = [];
		this.rangeDefinition.forEach(rangeDef => {
			const index = rangeDef.sourceIndexOf(value);
			if (index === -1) return;
			const destValue = rangeDef.getDestinationValue(index);
			numbers.push(destValue);
		})

		return numbers.length > 0 ? Math.min(...numbers) : value;
	}
}

function parseDigitsLine(line: string) {
	return line.split(' ').map(str => parseInt(str, 10)).filter(n => n > -1)
}

function main() {
	//const filePath = 'data/day5-calibration.txt';
	const filePath = 'data/day5.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');

	const lines = fileContent.split('\n');

	// e.g. [79, 14, 55, 13]
	const seeds: number[] = parseDigitsLine(lines[0].split(":")[1]);
	const amMaps: AlmanacMap[] = [];

	let am: AlmanacMap | null = null;
	lines.forEach(line => {
		if (line.endsWith(" map:")) {
			am = new AlmanacMap(line.split(' ')[0]);
		} else if (am && line) {
			const rangeDef = parseDigitsLine(line);
			if (rangeDef.length != 3) throw Error("Invalid data");
			const [destStart, sourceStart, rangeLength] = rangeDef;
			am.rangeDefinition.push(new RangeDef(destStart, sourceStart, rangeLength));
		} else if (am && line === "") {
			amMaps.push(am);
			am = null;
		}
	})

	const locationNumbers: number[] = [];
	seeds.forEach(seed => {
		let locationNumber: number = seed;
		const results = amMaps.map(am => {
			locationNumber = am.findLowest(locationNumber)
			return `${am.shortName} ${locationNumber}`
		})

		locationNumbers.push(locationNumber);
		console.log(`Seed ${seed}, ${results.join(", ")}`);
	})

	const lowestLocationNumber = Math.min(...locationNumbers);
	console.log("================")
	console.log(lowestLocationNumber)
}

main();