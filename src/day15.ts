import { AdventOfCode, mathAdd } from './utils.js'

function MyHash(input: string) {
    let value = 0;
    for (let i=0; i<input.length; i++) {
        const char = input[i];
        const asciiCode = char.charCodeAt(0);

        value += asciiCode;
        value *= 17;
        value = value%256;
    }
    return value;
}

function main() {
	const aoc = new AdventOfCode("day15", false);
    const sequences = aoc.fileContent.split(",");
    console.log(JSON.stringify(sequences));

    const sum: number = sequences.map(sequence => MyHash(sequence)).reduce(mathAdd, 0);

	aoc.printSum(sum)
}

main();