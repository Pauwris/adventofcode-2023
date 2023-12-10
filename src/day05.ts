import * as fs from 'fs';

class SourceDestination {
	source: number[] = []
	destination: number[] = []
}

class AlmanacMap {
	name: string = "";
	shortName: string = "";
	rangeDefinition: number[][] = [];
	ranges: SourceDestination[] = [];

	constructor(name: string) {
		this.name = name;
		this.shortName = name.split("-")[2];
	}

	calculate() {
		this.rangeDefinition.forEach(rangeDef => {
			const [destStart, sourceStart, rangeLength] = rangeDef;
			const list: number[] = [];

			const sd = new SourceDestination()
			for (let i=sourceStart; i<sourceStart + rangeLength; i++) {
				sd.source.push(i);
			}
			for (let i=destStart; i<destStart + rangeLength; i++) {
				sd.destination.push(i);
			}

			this.ranges.push(sd)
		})
	}

	findLowest(value: number) {
		const numbers: number[] = [];
		this.ranges.forEach(range => {
			const index = range.source.indexOf(value);
			if (index === -1) return;
			const destValue = range.destination[index];
			numbers.push(destValue);
		})

		return numbers.length > 0 ? Math.min(...numbers) : value;
	}
}

function parseDigitsLine(line: string) {
	return line.split(' ').map(str => parseInt(str, 10)).filter(n => n > -1)
}

function main() {
	const filePath = 'data/day5-calibration.txt';
	//const filePath = 'data/day5.txt';
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
			am.rangeDefinition.push(rangeDef);
		} else if (am && line === "") {
			amMaps.push(am);
			am = null;
		}
	})

	amMaps.forEach(am => am.calculate());

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