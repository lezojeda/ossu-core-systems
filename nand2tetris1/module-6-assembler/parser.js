const fs = require("fs");
const events = require("events");
const readline = require("readline");

/**
 * parse - Reads a Hack assembly language file line by line, parses each line by removing white space and comments,
 * and returns all parsed lines concatenated by newline characters together as a single string.
 *
 * @param {string} inputCode - The path to the input file withe code to be read.
 * @returns {Promise<string>} A promise that resolves to an array containing all parsed lines from the file
 */
async function parse(inputCode) {
	const rl = readline.createInterface({
		input: fs.createReadStream(inputCode),
		crlfDelay: Infinity,
	});

	let lines = [];

	rl.on("line", line => {
		const trimmedLine = line.split("//")[0].trim();

		if (trimmedLine) {
			lines.push(trimmedLine);
			console.log(`Line from file: ${trimmedLine}`);
		}
	});

	await events.once(rl, "close");

	return lines;
}

module.exports = { parse };
