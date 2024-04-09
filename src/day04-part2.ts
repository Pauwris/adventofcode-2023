import { AdventOfCode } from './utils.js'

class Card {
	#record: string;
	cardId: number = 0;
	winningNumbers: number[] = [];
	picks: number[] = [];
	wonBy: Card[] = [];

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

	get scoreCount():number {
		const scoringNumbers = this.picks
		.filter(n => this.winningNumbers.includes(n));

		return scoringNumbers.length;
	}

	get copiesCount(): number {
		return 1 + this.wonBy.length;
	}
	get wonBySorted(): number[] {
		return this.wonBy.map(card => card.cardId).sort((a, b) => a - b);
	}

	isWonBy(card: Card) {
		if (!card) throw Error(`Card.isWonBy::card is undefined`)
		this.wonBy.push(card);
	}
}

function mathAdd(accumulator: number, a: number) {
	return accumulator + a;
}


function main() {
	const aoc = new AdventOfCode("day4", false);
    const lines = aoc.lines;

	const cards = lines.map(line => new Card(line));
	cards.forEach((card, index, cards) => {
		for (let i=0; i<card.scoreCount; i++) {
			cards[index + i + 1]?.isWonBy(card)
		}
	})

	cards.forEach((card, index, cards) => {
		for (let i=0; i<card.scoreCount; i++) {
			for (let y=0; y<card.wonBy.length; y++) {
				cards[index + i + 1]?.isWonBy(card)
			}
		}
	})

	cards.forEach(card => {
		//console.log(`Card ${card.cardId} scoreCount=${card.scoreCount}, copiesCount=${card.copiesCount}, wonBy=[${card.wonBySorted.join(",")}]`);
	})

	const scores = cards.map(card => card.copiesCount);
	const sum = scores.reduce(mathAdd, 0)
	aoc.printSum(sum)
}

main();