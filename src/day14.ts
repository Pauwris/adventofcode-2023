import { AdventOfCode } from './utils.js'

class GridTile {
	isRock: boolean = false;
	isBolder: boolean = false;
	isEmpty: boolean = false;

	constructor(public grid: Grid, public chr: string) {
		switch (chr) {
			case "O": this.isBolder = true; break;
			case "#": this.isRock = true; break;
			default: this.isEmpty = true;
		}
	}

	get x(): number {
		return this.grid.getPosition(this).x;
	}
	get y(): number {
		return this.grid.getPosition(this).y;
	}
}

class Grid {
	#grid: GridTile[][] = [];
	width: number = 0;
	height: number = 0;	

	constructor(lines: string[]) {
		this.width = lines[0].length;
		this.height = lines.length;

		for (let y=0; y<this.height; y++) {
			this.#grid[y] = [];

			for (let x=0; x<this.width; x++) {
				const grid = new GridTile(this, lines[y][x]);
				this.#grid[y][x] = grid;
			}
		}
	}

	getPosition(tile: GridTile) {
		for (let y=0; y<this.height; y++) {
			for (let x=0; x<this.width; x++) {
				if (this.#grid[y][x] === tile) return  {y, x}
			}
		}

		throw Error("Element not found");
	}

	getGridTile(y: number, x: number): GridTile | null {
		if (x < 0 || x > this.width - 1) return null;
		if (y < 0 || y > this.height - 1) return null;
		return this.#grid[y][x];
	}

	swap(tile1: GridTile, tile2: GridTile) {
		const pos1 = this.getPosition(tile1);
		const pos2 = this.getPosition(tile2);
		this.#grid[pos1.y][pos1.x] = tile2;
		this.#grid[pos2.y][pos2.x] = tile1;
	}


	tiltSouth() {
		const bolders = this.#grid.flat().filter(tile => tile.isBolder);
		
		for (let i=0; i < this.height; i++) {
			bolders.forEach(bolder => {
				const northTile = this.getGridTile(bolder.y - 1, bolder.x);
				if (northTile?.isEmpty) {
					this.swap(bolder, northTile);
				}
			});
		}		
	}

	get loadAtNorth(): number {
		let sum = 0;
		for (let y=0; y<this.height; y++) {
			for (let x=0; x<this.width; x++) {
				if (this.#grid[y][x].isBolder) {
					sum += this.height - y;
				}
			}
		}

		return sum;
	}
	

	print() {
		for (let y=0; y<this.height; y++) {
			console.log(this.#grid[y].map(gridTile => gridTile.chr).join(""))
		}
	}
}

function main() {
	const aoc = new AdventOfCode("day14", false);

	const grid = new Grid(aoc.lines);
	grid.tiltSouth();
	grid.print();

	aoc.printSum(grid.loadAtNorth);
}

main();