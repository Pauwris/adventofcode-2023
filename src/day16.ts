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
    }
}

type MovementDirection = ('N' | 'E' | 'S' | 'W')
type ReflectDirections = Set<MovementDirection>;

class Beam {
    isActive = true;
    position: GridCoordinate;
    history: GridCoordinate[] = [];

    constructor(private grid: Grid, public startingPosition: GridCoordinate, public direction: MovementDirection) {
        this.position = startingPosition.clone();
        this.history.push(startingPosition.clone());
    }

    beam(): Beam[] {
        const newBeams: Beam[] = [];
        if (!this.isActive) return newBeams;

        const currentTile = this.grid.getGridTile(this.position);
        if (!currentTile) {
            this.isActive = false;
            return newBeams;
        }

        if (currentTile.isMirror) {            
            if (currentTile.chr === "\\") {
                switch(this.direction) {
                    case 'N': this.direction = 'W'; break;
                    case 'E': this.direction = 'S'; break;
                    case 'S': this.direction = 'E'; break;
                    case 'W': this.direction = 'N'; break;
                }                
            }
            if (currentTile.chr === "/") {
                switch(this.direction) {
                    case 'N': this.direction = 'E'; break;
                    case 'E': this.direction = 'N'; break;
                    case 'S': this.direction = 'W'; break;
                    case 'W': this.direction = 'S'; break;
                }                
            }
        }

        if (currentTile.isSplitter) {
            if (currentTile.chr === "|") {
                switch(this.direction) {
                    case 'E': case 'W': this.direction = 'S'; newBeams.push(new Beam(this.grid, this.position, 'N')); break;
                }                
            }
            if (currentTile.chr === "-") {
                switch(this.direction) {
                    case 'N': case 'S': this.direction = 'E'; newBeams.push(new Beam(this.grid, this.position, 'W')); break;
                }                
            }            
        }

        if (currentTile.relfectDirections.has(this.direction)) {
            this.isActive = false;
            return newBeams;
        }

        this.position.move(this.direction);
        currentTile.relfectDirections.add(this.direction);
        currentTile.isEnergized = true;        

        return newBeams;
    }
}

class GridTile {	
    isEnergized = false;
    relfectDirections: ReflectDirections = new Set();

	constructor(public grid: Grid, public chr: string) {}

	get isMirror(): boolean {
		return ["\\", "/"].includes(this.chr);
	}
    get isSplitter(): boolean {
		return ["|", "-"].includes(this.chr);
	}
	get isEmpty(): boolean {
		return this.chr === ".";
	}

    get printChr() {
        return this.isEnergized ? '#' : '.'
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

    getGridTile(c: GridCoordinate): GridTile | null {
		if (c.x < 0 || c.x > this.width - 1) return null;
		if (c.y < 0 || c.y > this.height - 1) return null;
		return this.grid[c.y][c.x];
	}

    get countOfEnergizedTiles() {
        return this.grid.flat().filter(tile => tile.isEnergized).length;
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



function main() {
	const aoc = new AdventOfCode("day16", false);
    
    const grid = new Grid(aoc.lines);
    const beams: Beam[] = [];
    const deadBeams: Beam[] = [];
    beams.push(new Beam(grid, new GridCoordinate(0, 0), 'E'));

    // Repeat beam processing until all are inactive/dead.    
    do {
        beams.forEach(beam => {
            beams.push(...beam.beam());
        })

        for (let i = beams.length - 1; i >= 0; i--) {
            if (beams[i].isActive === false) deadBeams.push(...beams.splice(i, 1));
        }
    } while (beams.length > 0);

    console.log(`Created ${deadBeams.length} beams`)

    aoc.writeOutput(grid.output.join("\r\n"))
	aoc.printSum(grid.countOfEnergizedTiles)

    // 6752 is too low
}

main();