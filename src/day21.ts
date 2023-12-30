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

class ElveStep {
    position: GridCoordinate;

    constructor(private grid: Grid, public startingPosition: GridCoordinate) {
        this.position = startingPosition.clone();
    }

    takeSteps(): ElveStep[] {
        const elveSteps: ElveStep[] = [];

        const currentTile = this.grid.getGridTile(this.position);
        if (!currentTile) return elveSteps;

        const neigbours: GridTile[] = allMovementDirections
        .map(direction => this.grid.getGridTile(this.position.clone().move(direction)))
        .filter((item): item is GridTile => item !== null)
        
        neigbours.forEach(tile => {
            if (tile.isValidPath) {
                tile.isWalked = true;
                elveSteps.push(new ElveStep(this.grid, tile.position))                
            }
        })

        return elveSteps;
    }

    get tile(): GridTile {
        const tile = this.grid.getGridTile(this.position);
        if (tile) return tile;
        throw new Error("ElveStep.tile::Unexpected error")
    }
}

class GridTile {	
    printChr: string;
    isWalked: boolean = false;
    
	constructor(public grid: Grid, public chr: string) {
        this.printChr = chr;
    }
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

    get isValidPath(): boolean {
        if (this.isRock || this.isStart || this.isWalked) return false;
        return true;
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

const dailySteps = 6;

function countPossibleGardenPlots(grid: Grid, lines: string[], startingPosition: GridCoordinate) {
    const elveSteps: ElveStep[] = [];
    elveSteps.push(new ElveStep(grid, startingPosition));

    for (let i=0; i<dailySteps; i++) {
        const nextSteps = elveSteps.map(elveStep => elveStep.takeSteps()).flat();
        elveSteps.length = 0;
        elveSteps.push(...nextSteps);
    }

    elveSteps.push(new ElveStep(grid, startingPosition));
    elveSteps.forEach(elveStep => {
        elveStep.tile.printChr = 'O'
    })

    return elveSteps.length;
}


function main() {
	const aoc = new AdventOfCode("day21", true);
    const lines = aoc.lines;

    const grid = new Grid(lines);
    const startingPosition = grid.startingPosition;

    let maxValue = countPossibleGardenPlots(grid, lines, startingPosition);
    grid.print();

	aoc.printSum(maxValue)
}


main();