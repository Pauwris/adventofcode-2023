import { AdventOfCode, mathAdd } from './utils.js'

class LinesGrid {
	private grid: string[] = [];
	width: number = 0;
	height: number = 0;	

	constructor(public id: number, lines: string[], public multiplyFactor = 100) {
        Object.assign(this.grid, lines);
		this.width = this.grid[0].length;
		this.height = this.grid.length;		
	}

    get mirrorIndexes(): number[] {
        const result: number[] = [];
        for (let y=0; y<this.height; y++) {
            if (this.grid[y] === this.grid[y+1]) result.push(y);
        }
        return result
    }

    get mirrorValue(): number {
        return this.mirrorIndexes.map(index => {
            if (index === -1) return 0;
            let yUp = index + 2;
            let yLow = index - 1;
            
            while (yUp < this.height) {
                let lowerRow = this.grid[yLow];
                let higherRow = this.grid[yUp];
    
                if (lowerRow && higherRow && lowerRow !== higherRow)  return 0;
                
                yUp++;
                yLow--;
            }
    
            return (index + 1) * this.multiplyFactor;
        }).reduce(mathAdd, 0);       
    }

    get rotated() {
       let rotatedList: string[] = Array.from({length: this.width}, () => "");
    
       for (let y = 0; y < this.height; y++) {
           for (let x = 0; x < this.width; x++) {
                rotatedList[x] += this.grid[y][x];  
           }
        }   

        return new LinesGrid(this.id, rotatedList, 1);
    }
}

function parseGrids(content: string[]) {
    const grids: LinesGrid[] = [];
    const lines: string[] = [];
    for (var i=0; i<content.length; i++) {
        const line = content[i];
        if (line.length === 0 || i === content.length - 1) {
            const grid = new LinesGrid(grids.length + 1, lines);
            grids.push(grid);
            lines.length = 0;
        } else {
            lines.push(line);
        }
    }  
    return grids;
}

function main() {
	const aoc = new AdventOfCode("day13", false);
    const grids = parseGrids(aoc.lines);
    grids.push(...grids.map(grid => grid.rotated))
    grids.sort((a, b) => a.id - b.id);

    const sum: number = grids.map(grid => grid.mirrorValue).reduce(mathAdd, 0);
	aoc.printSum(sum);
}


main();