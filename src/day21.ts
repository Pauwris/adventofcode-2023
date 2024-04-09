import { AdventOfCode } from './utils.js'

class GridCoordinate {
    constructor(public y: number, public x:number) {}
    clone() {
        return new GridCoordinate(this.y, this.x);
    }
    move(direction: MovementDirection) {
        switch (direction) {
            case 'N': this.y-=1; break;
            case 'E': this.x+=1; break;
            case 'S': this.y+=1; break;
            case 'W': this.x-=1; break;
        }
        return this;
    }
}

type MovementDirection = ('N' | 'E' | 'S' | 'W')
const allMovementDirections: MovementDirection[] = ['N', 'E', 'S', 'W'];

class Elve {
    position: GridCoordinate;

    constructor(private grid: Grid, public startingPosition: GridCoordinate) {
        this.position = startingPosition.clone();
    }

    walk() {
        const currentTile = this.grid.getGridTile(this.position);
        if (!currentTile) return;

        allMovementDirections
        .map(direction => this.grid.getGridTile(this.position.clone().move(direction)))
        .filter((item): item is GridTile => item !== null)
        .filter(tile => tile.isRock === false)
        .forEach(tile => {
            tile.isWalked = true;
        })
    }

    get tile(): GridTile {
        const tile = this.grid.getGridTile(this.position);
        if (tile) return tile;
        throw new Error("ElveStep.tile::Unexpected error")
    }
}

class GridTile {	
    isWalked = false;
    
	constructor(public grid: Grid, public chr: string) {}
    get position(): GridCoordinate {
        return this.grid.positionOf(this);
    }

	get isStart(): boolean {
		return this.chr === "S";
	}
    get isRock(): boolean {
		return this.chr === "#";
	}
	get isEmpty(): boolean {
		return this.chr === ".";
	}

    get printChr(): string {
        return this.isWalked ? 'O' : this.chr;
    }
}

class Grid {
	private grid: GridTile[][] = [];
    startingPosition = new GridCoordinate(0,0);
	width: number = 0;
	height: number = 0;	

	constructor(lines: string[]) {
		this.width = lines[0].length;
		this.height = lines.length;

		for (let y=0; y<this.height; y++) {
			this.grid[y] = [];

			for (let x=0; x<this.width; x++) {
				const tile = new GridTile(this, lines[y][x]);
                this.grid[y][x] = tile;

                if (tile.isStart) {
                    this.startingPosition = tile.position;
                }
			}
		}

	}

    positionOf(tile: GridTile): GridCoordinate {
        for (let y=0; y<this.height; y++) {
			for (let x=0; x<this.width; x++) {
				if (this.grid[y][x] === tile) return new GridCoordinate(y, x);
			}
		}
        throw new Error("Grid.positionOf::Unexpected error");
    }

    getGridTile(c: GridCoordinate): GridTile | null {
		if (c.x < 0 || c.x > this.width - 1) return null;
		if (c.y < 0 || c.y > this.height - 1) return null;
		return this.grid[c.y][c.x];
	}

    get tiles(): GridTile[] {
        return this.grid.flat();
    }

	print() {
		this.output.forEach(line => console.log(line));
	}
    get output() {
        const lines = [];
        for (let y=0; y<this.height; y++) {
			lines.push(this.grid[y].map(gridTile => gridTile.printChr).join(""))
		}
        return lines;
    }
}

const dailySteps = 64;

function countPossibleGardenPlots(grid: Grid, lines: string[], startingPosition: GridCoordinate) {
    const elve: Elve[] = [];
    elve.push(new Elve(grid, startingPosition));

    let count = 0;
    for (let i=dailySteps - 1; i >= 0; i--) {
        elve.forEach(elve => elve.walk());
        
        const walkedTiles = grid.tiles.filter(tile => tile.isWalked);
        elve.length = 0;
        elve.push(...walkedTiles.map(tile => new Elve(grid, tile.position)))

        if (i === 0) {
            grid.print();
        }        

        count = walkedTiles.length;
        walkedTiles.forEach(tile => tile.isWalked = false);      
    }

    return count;
}


function main() {
	const aoc = new AdventOfCode("day21", false);
    const lines = aoc.lines;

    const grid = new Grid(lines);
    const startingPosition = grid.startingPosition;

    let maxValue = countPossibleGardenPlots(grid, lines, startingPosition);
	aoc.printSum(maxValue)
}


main();