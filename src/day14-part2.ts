import { AdventOfCode } from './utils.js'

class GridTile {	
	constructor(public grid: Grid, public chr: string) {}

	get isBolder(): boolean {
		return this.chr === "O";
	}
	get isRock(): boolean {
		return this.chr === "#";
	}
	get isEmpty(): boolean {
		return this.chr === ".";
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
				this.#grid[y][x] = new GridTile(this, lines[y][x]);
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

	

	tiltNorth = () => this.tiltY(-1);
	tiltEast = () => this.tiltX(1);
	tiltSouth = () => this.tiltY(1);	
	tiltWest = () => this.tiltX(-1);

	tiltY(yDirection: number) {	
		for (let x=0; x < this.width; x++) {
			let mutated: boolean;
			do {
				mutated = false;
				for (let y=0; y < this.height; y++) {
					const tile1 = this.#grid[y][x];
					const tile2 = this.#grid[y + yDirection] ? this.#grid[y + yDirection][x] : null;
					if (tile1.isEmpty && tile2?.isBolder) {
						this.#grid[y][x] = tile2;
						this.#grid[y + yDirection][x] = tile1;
						mutated = true;
					}
				}
			} while (mutated)
		}	 	
	}
	tiltX(xDirection: number) {	
		for (let y=0; y < this.height; y++) {
			let mutated: boolean;
			do {
				mutated = false;
				for (let x=0; x < this.width; x++) {
					const tile1 = this.#grid[y][x];
					const tile2 = this.#grid[y][x + xDirection];
					if (tile1.isEmpty && tile2?.isBolder) {
						this.#grid[y][x] = tile2;
						this.#grid[y][x + xDirection] = tile1;
						mutated = true;
					}
				}
			} while (mutated)
		}	 	
	}

	tiltCycle() {
		this.tiltSouth(); // Rocks roll north
		this.tiltEast();  // Rocks roll west
		this.tiltNorth();
		this.tiltWest();		
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

	console.log("Start")
	const startTime = new Date();
	const output = [];
	for (let i=0; i<=1000; i++) {
		grid.tiltCycle();
		output.push(grid.loadAtNorth)
	}
	console.log(new Date().getTime() - startTime.getTime())

	aoc.writeOutput(output.join("\r\n"));
}

main();