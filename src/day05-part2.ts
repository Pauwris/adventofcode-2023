import * as fs from 'fs';

let lowestLocationNumber: number = Infinity;

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

function explodeSeeds(rangeOfSeeds: number[], amMaps: AlmanacMap[]) {
	// Convert to a 2-dimensional array of pairs
	const seedPairs: number[][] = [];

	for (let i = 0; i < rangeOfSeeds.length; i += 2) {
		const pair: number[] = [rangeOfSeeds[i], rangeOfSeeds[i + 1]];
		seedPairs.push(pair);
	}

	seedPairs.forEach((seedPair, index, items) => {
		const [start, range] = seedPair;

		console.log(`seedPair [${index + 1}/${items.length}]: ${JSON.stringify(seedPair)}, range=${range}`)
		for (let i=0; i<range; i++) {
			const seedValue = start + i;
			calculate(seedValue, amMaps)
		}
	})
}

function calculate(seed: number, amMaps: AlmanacMap[]) {

	let locationNumber: number = seed;
	const results = amMaps.map(am => {
		locationNumber = am.findLowest(locationNumber)
		return `${am.shortName} ${locationNumber}`
	})

	if (locationNumber < lowestLocationNumber) lowestLocationNumber = locationNumber;
}

function main() {
	//const filePath = 'data/day5-calibration.txt';
	const filePath = 'data/day5.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');

	const lines = fileContent.split('\n');

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

	// e.g. [79, 14, 55, 13]
	const seeds: number[] = parseDigitsLine(lines[0].split(":")[1])
	explodeSeeds(seeds, amMaps);

	console.log("================")
	console.log(lowestLocationNumber)
}

main();