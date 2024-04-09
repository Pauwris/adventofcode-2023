import { AdventOfCode } from './utils.js'

class GridTile {
	printChr: string;
	isStart: boolean = false;
	isGround: boolean = false;
	isLinked: boolean = false;
	isEnclosed: boolean = false;

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
	get isBorderTile(): boolean {
		if (this.x === 0 || this.x === this.grid.width) return true;
		if (this.y === 0 || this.y === this.grid.height) return true;

		return false;
	}

	get pipeAtN() {
		return this.grid.getPipe(this.y - 1, this.x, 'S');
	}
	get pipeAtE() {
		return this.grid.getPipe(this.y, this.x + 1, 'W');
	}
	get pipeAtS() {
		return this.grid.getPipe(this.y + 1, this.x, 'N');
	}
	get pipeAtW() {
		return this.grid.getPipe(this.y, this.x - 1, 'E');
	}

	get unlinkedGroundAtN() {
		return this.grid.getUnlinkedGround(this.y - 1, this.x);
	}
	get unlinkedGroundAtE() {
		return this.grid.getUnlinkedGround(this.y, this.x + 1);
	}
	get unlinkedGroundAtS() {
		return this.grid.getUnlinkedGround(this.y + 1, this.x);
	}
	get unlinkedGroundAtW() {
		return this.grid.getUnlinkedGround(this.y, this.x - 1);
	}


	constructor(public grid: Grid, public chr: string, private x: number, private y: number) {
		this.printChr = chr;
		switch(chr) {
			case '|': this.N = true; this.S = true; break;
			case '-': this.W = true; this.E = true; break;
			case 'L': this.N = true; this.E = true; break;
			case 'J': this.N = true; this.W = true; break;
			case '7': this.S = true; this.W = true; break;
			case 'F': this.S = true; this.E = true; break;
			case '.': this.isGround = true; break;
			case 'S': this.isStart = true; this.N = true; this.E = true; this.S = true; this.W = true; break;
			default: throw new Error(`Unknown chr '${chr}'`)
		}
	}

	getNextPipe(): GridTile {
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
	getNextUnlinkedGround(): GridTile | null {
		return this.unlinkedGroundAtS ?? this.unlinkedGroundAtW ?? this.unlinkedGroundAtN ?? this.unlinkedGroundAtE;
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

	get enclosedGrounds() {
		return this.#grid.flat().filter(tile => tile.isEnclosed);
	}

	getGridTile(y: number, x: number): GridTile | null {
		if (x < 0 || x > this.width - 1) return null;
		if (y < 0 || y > this.height - 1) return null;
		return this.#grid[y][x];
	}
	getUnlinkedGround(y: number, x: number): GridTile | null {
		const tile = this.getGridTile(y, x);
		return tile?.isGround === true ? tile : null;
	}
	getPipe(y: number, x: number, needsGate: ('N' | 'E' | 'S' | 'W' | null)): GridTile | null {
		let tile = this.getGridTile(y, x);
		if (tile && tile.isPipe) {
			if (needsGate) {
				return tile[needsGate] ? tile : null;
			} else {
				return tile;
			}
		}
		return null;
	}

	calculateRoute() {
		let pipe = this.startTile;
		this.route.push(pipe);

		do {
			pipe = pipe.getNextPipe();
			this.route.push(pipe);

			if (this.route.length > this.width * this.height) throw new Error('Routing failed');
		} while (pipe.isStart === false);
	}
	calculateEnclosed() {
		const tiles = this.#grid.flat();
		const innerGrounds = tiles.filter(tile => tile.isGround && tile.isBorderTile === false);

		innerGrounds.forEach(tile => {
			this.#calculateEnclosedFrom(tile);
		})
	}

	#calculateEnclosedFrom(startTile: GridTile) {
		const route: GridTile[] = [];
		route.push(startTile);

		let success = false;
		let groundTile: GridTile | null = startTile;
		do {
			groundTile = groundTile.getNextUnlinkedGround();
			if (groundTile) {
				if (groundTile.isBorderTile) break;

				groundTile.isLinked = true;
				route.push(groundTile);
			} else {
				success = true;
				break;
			}

			if (route.length > this.width * this.height) throw new Error('Enclosed routing failed');
		} while (groundTile);

		if (success) {
			route.forEach(tile => {
				tile.printChr = 'I';
				tile.isEnclosed = true
			});
		} else {
			route.forEach(tile => tile.isLinked = false);
		}
	}

	plotRoute() {
		const tiles = this.#grid.flat();

		tiles.forEach(tile => {
			if (tile.isStart) {
				tile.printChr = 'S';
			} else if (this.route.includes(tile)) {
				tile.printChr = 'x';
			} else {
				tile.printChr = '.'
			}
		})
	}

	print() {
		for (let y=0; y<this.height; y++) {
			console.log(this.#grid[y].map(gridTile => gridTile.printChr).join(""))
		}
	}
}

function main() {
	const aoc = new AdventOfCode("day10", true);

	const grid = new Grid(aoc.lines);
	grid.calculateRoute();
	grid.plotRoute();
	grid.calculateEnclosed();
	grid.print();

	const distance = grid.route.length - 1;
	const enclosedGrounds = grid.enclosedGrounds.length;
	console.log(`Grid (${grid.height} x ${grid.width}) - max distance=${grid.height * grid.width}, distance=${distance}, distance/2=${distance / 2}, enclosedGrounds=${enclosedGrounds}`)

	const sum: number = enclosedGrounds
	aoc.printSum(sum);
}

main();