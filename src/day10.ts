import { AdventOfCode } from './utils.js'

class GridTile {
	printChr: string;
	isStart: boolean = false;
	isGround: boolean = false;

	// Piping directions
	N: boolean = false;
	E: boolean = false;
	S: boolean = false;
	W: boolean = false;

	connectedTo: GridTile | null = null;

	get isPipe():boolean {
		return this.N || this.E || this.S || this.W || this.isStart;
	}
	get isUnconnected(): boolean {
		return this.connectedTo instanceof GridTile === false;
	}

	get pipeAtN() {
		return this.grid.getPipe(this.y - 1, this.x);
	}
	get pipeAtE() {
		return this.grid.getPipe(this.y, this.x + 1);
	}
	get pipeAtS() {
		return this.grid.getPipe(this.y + 1, this.x);
	}
	get pipeAtW() {
		return this.grid.getPipe(this.y, this.x - 1);
	}

	constructor(public grid: Grid, public chr: string, private x: number, private y: number) {
		this.printChr = chr;
		switch(chr) {
			case '|': this.N = true; this.S = true; break;
			case '-': this.W = true; this.E = true; break;
			case 'L': this.N = true; this.E = true; this.printChr = '⭨'; break;
			case 'J': this.N = true; this.W = true; this.printChr = '⭩'; break;
			case '7': this.S = true; this.W = true; this.printChr = '⭦'; break;
			case 'F': this.S = true; this.E = true; this.printChr = '↗'; break;
			case '.': this.isGround = true; break;
			case 'S': this.isStart = true; this.N = true; this.E = true; this.S = true; this.W = true; break;
			default: throw new Error(`Unknown chr '${chr}'`)
		}
	}

	conectNextPipe(): GridTile {
		let nextPipe =
			(this.S && this.pipeAtS?.isUnconnected ? this.pipeAtS : null) ??
			(this.W && this.pipeAtW?.isUnconnected ? this.pipeAtW : null) ??
			(this.N && this.pipeAtN?.isUnconnected ? this.pipeAtN : null) ??
			(this.E && this.pipeAtE?.isUnconnected ? this.pipeAtE : null)

		if (!nextPipe) {
			throw Error("Pipeline disconnected");
		} if (this.connectedTo) {
			throw Error("connectedTo is already defined");
		} else if (!this.isStart) {
			this.connectedTo = nextPipe;
		}

		return nextPipe;
	}
}

class Grid {
	#grid: GridTile[][] = [];
	width: number = 0;
	height: number = 0;
	startTile: GridTile;
	route: GridTile[] = [];

	constructor(lines: string[]) {
		this.width = lines[0].length;
		this.height = lines.length;

		let startTile;
		for (let y=0; y<this.height; y++) {
			this.#grid[y] = [];

			for (let x=0; x<this.width; x++) {
				const grid = new GridTile(this, lines[y][x], x, y);
				this.#grid[y][x] = grid;

				if (grid.isStart) {
					if (startTile) {
						throw Error("Found more than one start");
					} else {
						startTile = grid;
					}
				}
			}
		}

		if (!startTile) throw Error("Start not found");
		this.startTile = startTile;
	}

	getGridTile(y: number, x: number): GridTile | null {
		if (x < 0 || x > this.width - 1) return null;
		if (y < 0 || y > this.height - 1) return null;
		return this.#grid[y][x];
	}
	getPipe(y: number, x: number): GridTile | null {
		let tile = this.getGridTile(y, x);
		return tile?.isPipe ? tile : null;
	}

	calculateRoute() {
		let tile = this.startTile;

		do {
			tile = tile.conectNextPipe();
			this.route.push(tile);

			if (this.route.length > this.width * this.height) throw new Error('Routing failed');
		} while (tile.isStart === false)
	}

	print() {
		for (let y=0; y<this.height; y++) {
			console.log(this.#grid[y].map(gridTile => gridTile.chr).join(""))
		}
	}
}

function main() {
	const aoc = new AdventOfCode("day10", false);

	const grid = new Grid(aoc.lines);
	grid.calculateRoute();
	grid.print();

	console.log(`Grid (${grid.height} x ${grid.width}) - max route=${grid.height * grid.width}, route length=${grid.route.length}, route length/2=${grid.route.length/2}`)

	const sum: number = grid.route.length / 2;
	aoc.printSum(sum);

	// 6813 is too low
	// 6814 is too low
}

main();