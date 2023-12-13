import * as fs from 'fs';

function parsenNumbers(line: string): number[] {
	const matches = line.match(/\d+/g);
	return matches ? matches.map(n => parseInt(n, 10)).filter(n => !isNaN(n)) : [];
}

class BoatRace {
	constructor(public raceTime: number, public record: number) {}
}

function main() {
	//const filePath = 'data/day6-calibration.txt';
	const filePath = 'data/day6.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');

	const [lineTime, lineDistance]  = fileContent.split('\n');
	const raceTime = parseInt(parsenNumbers(lineTime).join(''));
	const record = parseInt(parsenNumbers(lineDistance).join(''));
	const race = new BoatRace(raceTime, record);

	let fasterCount = 0;
	for (let holdTime=1; holdTime < race.raceTime; holdTime++) {
		const dinstance = (race.raceTime - holdTime) * holdTime;
		if (dinstance > race.record) fasterCount++;
	}

	const sum: number = fasterCount;
	console.log("================")
	console.log(sum)
}

main();