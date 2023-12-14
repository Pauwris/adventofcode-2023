import * as fs from 'fs';

class CamelCard {
	value: number = 0;

	constructor(public card: string, public bid: number) {
		this.value = this.#value;
	}

	get #value(): number {
		if (this.isFiveOfAKind) return 70;
		if (this.isFourOfAKind) return 60;
		if (this.isFullhouse) return 50;
		if (this.isThreeOfAKind) return 40;
		if (this.isTwoOfAPair) return 30;
		if (this.isOneOfPair) return 20;
		if (this.isHighCard) return 10;
		return 0;
	}

	get isFiveOfAKind():boolean {
		return Array.from(this.card).every(chr => chr === this.card[0])
	}
	get isFourOfAKind():boolean {
		return this.#isXofAKind(4);
	}
	get isFullhouse():boolean {
		const cc = this.#charCount;
		return Object.values(cc).length === 2 && cc[Object.keys(cc)[0]] !== cc[Object.keys(cc)[1]];
	}
	get isThreeOfAKind():boolean {
		return this.#isXofAKind(3);
	}
	get isTwoOfAPair():boolean {
		return this.#isXofAPair(2);
	}
	get isOneOfPair():boolean {
		return this.#isXofAPair(1);
	}
	get isHighCard():boolean {
		return Object.values(this.#charCount).length === 5;
	}

	#isXofAKind(x: number): boolean {
		// Check if at least X characters have the same count
		const identicalCharCounts = Object.values(this.#charCount).filter(count => count >= x);
		return identicalCharCounts.length > 0;
	}
	#isXofAPair(x: number): boolean {
		return Object.values(this.#charCount).filter(count => count === x).length === x;
	}
	get #charCount(): Record<string, number> {
		// Count the occurrences of each character
		const charCount: Record<string, number> = {};
		for (const char of this.card) {
			charCount[char] = (charCount[char] || 0) + 1;
		}
		return charCount
	}
}

const CharRanking = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

function sortChar(a: string, b: string): number {
    const indexA = CharRanking.indexOf(a);
    const indexB = CharRanking.indexOf(b);
    return indexB - indexA;
}
function sortString(a: string, b: string): number {
	if (a.length != b.length) throw Error("Unexpected issue");
	for (let i=0; i<a.length; i++) {
		const sortValue = sortChar(a[i], b[i])
		if (sortValue === 0) continue;
		return sortValue;
	}
	return 0;
}

function main() {
	//const filePath = 'data/day7-calibration.txt';
	const filePath = 'data/day7.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const camelCards = fileContent.split("\n").map(line =>  {
		const [card, bid] = line.split(" ");
		return new CamelCard(card, parseInt(bid, 10));
	})
	.sort((a, b) => {
		if (a.value - b.value === 0) {
			return sortString(a.card, b.card);
		}
		return a.value - b.value;
	})

	camelCards.map((card, index) => console.log(`${index + 1} - ${JSON.stringify(card)} - ${card.bid * (index + 1)}`));

	const sum: number = camelCards
	.map((card, index) => card.bid * (index + 1))
	.reduce((acc, num) => acc + num, 0);

	console.log("================")
	console.log(sum)
}

main();