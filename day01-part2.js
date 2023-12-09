import fs from "fs";

const englishDigits = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const reversedEnglishDigits = englishDigits.map(str => reverseString(str));

function main() {
	const filePath = 'data/inputday1.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const lines = fileContent.split('\n');

	let sum = 0;
	for (const str of lines) {
		const matchFirstDigit = NumberMatch.fromRegexMatch(str.match(/\d/));
		const matchLastDigit =  NumberMatch.fromRegexMatch(reverseString(str).match(/\d/));
		const firstWordMatch = findFirstWord(str, englishDigits);
		const lastWordMatch = findFirstWord(reverseString(str), reversedEnglishDigits);

		if (lastWordMatch) {
			lastWordMatch.word = reverseString(lastWordMatch.word);
		}

		const first = NumberMatch.getFirtByIndex(matchFirstDigit, firstWordMatch);
		const last = NumberMatch.getFirtByIndex(matchLastDigit, lastWordMatch);

		const numb = first.value * 10 + last.value;
		console.log(`${numb} - ${str} - ${first.toString()} - ${last.toString()}`);
		sum += numb;
	}

	console.log(sum);
}

class NumberMatch {
	constructor(word, index, value) {
		this.word = word;
		this.index = index;
		this.value = value;
	}

	toString() {
		return this.word;
	}

	/**
	 * @param {RegExpMatchArray} m
	 */
	static fromRegexMatch(m) {
		return m ? new NumberMatch(m[0], m.index, parseInt(m[0], 10)) : null;
	}

	/**
	 *
	 * @param {NumberMatch} a
	 * @param {NumberMatch} b
	 */
	static getFirtByIndex(a, b) {
		if (!a && !b) throw Error(`getFirst`);
		if (a && b) return a.index < b.index ? a : b;
		if (!a) return b;
		if (!b) return a;
	}
}


function findFirstWord(text, words) {
	let str = "";
	for (let i=0; i<text.length; i++) {
		str += text[i];

		for (let w=0; w<words.length; w++) {
			const word = words[w];
			const index = str.indexOf(word);
			if (index > -1) {
				const value = words.findIndex(item => item === word) + 1;
				return new NumberMatch(word, index, value);
			}
		}
	}
	return null;
}

function reverseString(str) {
	if (typeof str !== "string") return null;
	return str.split('').reverse().join('');
}

main();