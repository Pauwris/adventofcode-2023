import fs from "fs";

function main() {
	const filePath = 'data/inputday1.txt';
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const lines = fileContent.split('\n');

	let sum = 0;
	for (const str of lines) {
		// Use regular expressions to find the first and last digit
		const firstDigit = parseInt(str.match(/\d/)[0], 10);
		const lastDigit = parseInt(str.match(/\d(?=\D*$)/)[0], 10);
		const numb = firstDigit * 10 + lastDigit;

		console.log(`${numb} - ${str}`);
		sum += numb;
	}

	console.log(sum);
}

main();