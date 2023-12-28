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
}

class Grid {
	private grid: GridTile[][] = [];
	width: number = 0;
	height: number = 0;	

	constructor(lines: string[]) {
		this.width = lines[0].length;
		this.height = lines.length;

		for (let y=0; y<this.height; y++) {
			this.grid[y] = [];

			for (let x=0; x<this.width; x++) {
				this.grid[y][x] = new GridTile(this, lines[y][x]);
			}
		}

	}

	private tiltNorth = () => this.tiltY(-1);
	private tiltEast = () => this.tiltX(1);
	private tiltSouth = () => this.tiltY(1);	
	private tiltWest = () => this.tiltX(-1);

	private tiltY(yDirection: number) {	
		for (let x=0; x < this.width; x++) {
			let mutated: boolean;
			do {
				mutated = false;
				for (let y=0; y < this.height; y++) {
					const tile1 = this.grid[y][x];
					const tile2 = this.grid[y + yDirection] ? this.grid[y + yDirection][x] : null;
					if (tile1.isEmpty && tile2?.isBolder) {
						this.grid[y][x] = tile2;
						this.grid[y + yDirection][x] = tile1;
						mutated = true;
					}
				}
			} while (mutated)
		}	 	
	}
	
	private tiltX(xDirection: number) {	
		for (let y=0; y < this.height; y++) {
			let mutated: boolean;
			do {
				mutated = false;
				for (let x=0; x < this.width; x++) {
					const tile1 = this.grid[y][x];
					const tile2 = this.grid[y][x + xDirection];
					if (tile1.isEmpty && tile2?.isBolder) {
						this.grid[y][x] = tile2;
						this.grid[y][x + xDirection] = tile1;
						mutated = true;
					}
				}
			} while (mutated)
		}	 	
	}

	spin() {
		this.tiltSouth(); // Rocks roll north
		this.tiltEast();  // Rocks roll west
		this.tiltNorth();
		this.tiltWest();		
	}

	get loadAtNorth(): number {
		let sum = 0;
		for (let y=0; y<this.height; y++) {
			for (let x=0; x<this.width; x++) {
				if (this.grid[y][x].isBolder) {
					sum += this.height - y;
				}
			}
		}

		return sum;
	}

	print() {
		for (let y=0; y<this.height; y++) {
			console.log(this.grid[y].map(gridTile => gridTile.chr).join(""))
		}
	}

	serialize() {
		return this.grid.flat().map(tile => tile.chr).join("");
	}
}

function main() {
	const aoc = new AdventOfCode("day14", false);

	const grid = new Grid(aoc.lines);

	const targetSpinCycles = 1000000000;
	let indexOfOriginal = 0;	

	const previousGrids: string[] = [];	
	const loadsAtNorth: number[] = [];
	while (true) {
		grid.spin();

		const serializedGrid = grid.serialize();

		indexOfOriginal = previousGrids.indexOf(serializedGrid);
		if (indexOfOriginal != -1) break;

		previousGrids.push(serializedGrid);
		loadsAtNorth.push(grid.loadAtNorth);
	}

	const rampUpCycles = indexOfOriginal;
	const repeatedLoopLength = previousGrids.length - rampUpCycles;
	const spinsToDo = (targetSpinCycles - rampUpCycles) % repeatedLoopLength;
	const index = rampUpCycles + spinsToDo - 1
		
	aoc.printSum(loadsAtNorth[index])
}

main();