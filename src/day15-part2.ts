import { AdventOfCode, mathAdd } from './utils.js'

const boxCount = 256;

function MyHash(input: string) {
    let value = 0;
    for (let i=0; i<input.length; i++) {
        const char = input[i];
        const asciiCode = char.charCodeAt(0);

        value += asciiCode;
        value *= 17;
        value = value%boxCount;
    }
    return value;
}

class Box {
    lenses: Lens[] = [];
    constructor(public id: number) {}

    indexOf(label: string) {
        return this.lenses.findIndex(item => item.label === label)
    }
    remove(index: number) {
        this.lenses.splice(index, 1);
    }
    append(lens: Lens) {
        this.lenses.push(lens);
    }
    replace(index: number, lens: Lens) {
        this.lenses[index] = lens;
    }
}

class Lens {
    constructor(public label: string, public focalLength: number) {}    
    toJSON() {
        return `[${this.label} ${this.focalLength}]`
    }
}

function main() {
	const aoc = new AdventOfCode("day15", false);

    const boxes: Box[] = [];
    for (let i=0; i<boxCount; i++) {
        boxes.push(new Box(i));
    }

    const sequences = aoc.fileContent.split(",");

    sequences.forEach(sequence => {        
        const operation = sequence.endsWith("-") ? "-" : "=";
        const [label, focalLengthStr] = sequence.split(operation);
        const focalLength = focalLengthStr ? parseInt(focalLengthStr, 10) : 0;

        const boxId = MyHash(label);
        const box = boxes[boxId];
        const oldLensIndex = box.indexOf(label);

        if (operation === "-" && oldLensIndex > -1) {
            box.remove(oldLensIndex);
        }
        if (operation === "=") {
            if (oldLensIndex === -1) {
                box.append(new Lens(label, focalLength))
            } else {
                box.replace(oldLensIndex, new Lens(label, focalLength))
            }
        }
    })

    let sum = 0;

    boxes
    //.filter(box => box.lenses.length > 0)
    .forEach(box => {        
        let boxTotal = 0;
        const boxNo = box.id + 1;
        box.lenses.forEach((lens, index) => {
            const slotNo = index + 1;
            boxTotal += boxNo * slotNo * lens.focalLength;
        });

        //console.log(`${boxNo} (box ${box.id}): ${JSON.stringify(box.lenses)} = ${boxTotal}`)

        sum += boxTotal;
    });


	aoc.printSum(sum)
}

main();