import { AdventOfCode } from './utils.js'

class GridTile {
	constructor(public chr: string, private x: number, private y: number) {}
}

class Grid {
	#grid: GridTile[][] = [];
	width: number = 0;
	height: number = 0;

	constructor(lines: string[]) {
		this.width = lines[0].length;
		this.height = lines.length;

		for (let y=0; y<this.height; y++) {
			for (let x=0; x<this.width; x++) {
				this.#grid[y][x] = new GridTile(lines[y][x], x, y);
			}
		}
	}

	print() {
		for (let y=0; y<this.height; y++) {
			console.log(this.#grid[y].map(gridTile => gridTile.chr))
		}
	}
}

function main() {
	const aoc = new AdventOfCode("day10", true);

	const grid = new Grid(aoc.lines);
	grid.print();

	const sum: number = 0;
	aoc.printSum(sum);
}

main();