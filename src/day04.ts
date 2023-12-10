import * as fs from 'fs';

class Card {
	#record: string;
	cardId: number = 0;
	winningNumbers: number[] = [];
	picks: number[] = [];

	constructor(record: string) {
		this.#record = record;

		const [cardName, data] = this.#record.split(':');
		this.#parseGardId(cardName);
		this.#parseData(data.trim());
	}

	#parseGardId(cardName: string) {
        const match = cardName.match(/Card (\d+)/);
        if (match && match[1] && parseInt(match[1], 10) > 0) {
            this.cardId = parseInt(match[1], 10);
        }
    }
	#parseData(data: string) {
		const [winningNumbersStr, picksStr] = data.split('|');

		this.winningNumbers = winningNumbersStr
		.split(' ')
		.map(item => parseInt(item, 10))
		.filter(n => n > 0);

		this.picks = picksStr
		.split(' ')
		.map(item => parseInt(item, 10))
		.filter(n => n > 0);
    }

	get score():number {
		const scoringNumbers = this.picks
		.filter(n => this.winningNumbers.includes(n));

		return scoringNumbers.length > 0 ? 1 * Math.pow(2, scoringNumbers.length - 1) : 0;
	}
}

function mathAdd(accumulator: number, a: number) {
	return accumulator + a;
  }


function main() {
	//const filePath = 'data/day4-calibration.txt';
	const filePath = 'data/day4.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');

	const cards = fileContent.split('\n').map(line => new Card(line));
	cards.forEach(card => {
		console.log(`Card ${card.cardId} score ${card.score}`);
	})

	const scores = cards.map(card => card.score);
	const sum = scores.reduce(mathAdd, 0)
	console.log(sum);
}

main();