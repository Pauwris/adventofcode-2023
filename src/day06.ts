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
	const timings = parsenNumbers(lineTime);
	const records = parsenNumbers(lineDistance);
	const races = timings.map((raceTime, index) => new BoatRace(raceTime, records[index]))

	const recordRaceCount = races.map(race => {
		let fasterCount = 0;
		for (let holdTime=1; holdTime < race.raceTime; holdTime++) {
			const dinstance = (race.raceTime - holdTime) * holdTime;
			if (dinstance > race.record) fasterCount++;
		}
		return fasterCount;
	})

	const sum: number = recordRaceCount.reduce((acc, num) => acc * num, 1);
	console.log("================")
	console.log(sum)
}

main();