import * as fs from 'fs';

class BagContent {
	green = 0;
	red = 0;
	blue = 0;

	constructor(content: string) {
		content.split(",").forEach(countOfColor => {
			const [countStr, color] = countOfColor.trim().split(" ");
			const count = parseInt(countStr, 10);
			switch (color) {
				case "red": this.red = count; break;
				case "green": this.green = count; break;
				case "blue": this.blue = count; break;
			}
		})
	}
}

class BallsInBagGame {
	#record: string;
	gameId: number = 0;
	picks: BagContent[] = [];

	constructor(record: string) {
		this.#record = record;
		this.#parseGameId();
		this.#parsePicks();
	}
	toString() {
		return `${JSON.stringify(this)} - ${this.#record}`;
	}

	#parseGameId() {
		const match = this.#record.match(/Game (\d+)/);
		if (match && match[1] && parseInt(match[1], 10) > 0) {
			this.gameId = parseInt(match[1], 10);
		}
	}
	#parsePicks() {
		this.picks = this.#record
		.split(":")[1].trim()
		.split(";")
		.map(bagContent => new BagContent(bagContent))
	}
	isPossible(game: BagContent) {
		return this.picks.every(pick => pick.red <= game.red && pick.green <= game.green && pick.blue <= game.blue)
	}
}

function main() {
	const filePath = 'data/day2-calibration.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const lines = fileContent.split('\n');

	const question1 = new BagContent("12 red, 13 green, 14 blue");

	let sum = 0;
	lines.forEach((line: string) => {
		const b = new BallsInBagGame(line);
		if (b.isPossible(question1)) sum += b.gameId;
		console.log(`${b.gameId} is ${b.isPossible(question1) ? "" : "not "}possible`);
	})

	console.log(`==============`)
	console.log(sum);
}

main();