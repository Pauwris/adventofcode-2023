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
	get minimumGame() {
		const g = new BagContent("");
		g.red = this.picks.reduce((maxObject, currentObject) => currentObject.red > maxObject.red ? currentObject : maxObject, this.picks[0]).red;
		g.green = this.picks.reduce((maxObject, currentObject) => currentObject.green > maxObject.green ? currentObject : maxObject, this.picks[0]).green;
		g.blue = this.picks.reduce((maxObject, currentObject) => currentObject.blue > maxObject.blue ? currentObject : maxObject, this.picks[0]).blue;
		return g;
	}
	get powerOfMinimumGame() {
		const g = this.minimumGame;
		return g.red * g.green * g.blue;
	}
}

function main() {
	const filePath = 'data/day2.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const lines = fileContent.split('\n');

	let sum = 0;
	lines.forEach((line: string) => {
		const b = new BallsInBagGame(line);
		console.log(`${b.gameId} = ${b.powerOfMinimumGame}`);
		sum += b.powerOfMinimumGame;
	})

	console.log(`==============`)
	console.log(sum);
}

main();