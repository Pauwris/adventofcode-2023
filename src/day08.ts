import { AdventOfCode } from './utils.js'

type LR = ('L' | 'R')
interface LRNode {
	L: string
	R: string
}

class Node {
	key: string = "";
	values: LRNode;

	constructor(line: string) {
		// "AAA = (BBB, CCC)"
		const [key, node] = line.split("=").map(item => item.trim());
		this.key = key;

		const regex = /\(([^,]+),\s*([^)]+)\)/;
		const match = regex.exec(node);
		if (match) {
			this.values = {
				L: match[1],
				R: match[2]
			}
		} else {
			throw new Error("Invalid data")
		}
	}
}

function main() {
	const aoc = new AdventOfCode("day8", false);
	const directions: ('L' | 'R')[] = aoc.lines[0].split('').map(chr => chr === "R" ? "R" : "L");

	const nodes = new Map(
		aoc.lines.slice(2)
		.map(line => {
			const node = new Node(line);
			return [node.key, node];
		})
	);

	let directionIndex = 0;
	let currentDirection: LR;
	let steps = 1;
	let node = nodes.get("AAA");
	if (!node) throw new Error("Start node not found")
	while (true) {
		currentDirection = directions[directionIndex];
		node = nodes.get(node.values[currentDirection])

		if (node && node.key === "ZZZ") {
			break;
		} else if (!node) {
			throw new Error("Invalid nodes")
		}

		steps++;
		directionIndex++;
		if (directionIndex >= directions.length) directionIndex = 0;
	}

	const sum: number = steps;
	aoc.printSum(sum);
}

main();