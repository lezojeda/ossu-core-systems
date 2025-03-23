const fsp = require("node:fs/promises");
const path = require("node:path");
const { parse } = require("./parser");
const { translateToBinary } = require("./code");
const { buildSymbolTable } = require("./symbolTable");

/**
 * assemble - Creates a 'Prog.hack' representing the translated Hack machine code from the given Hack assembly program.
 *
 * @param {string} inputFilePath - A string representing the hack assembly program's file path.
 * @returns {void} - Does not return a value.
 * @throws Will log an error message if file creation fails.
 * @assumes The input is always valid.
 */
async function assemble(inputFilePath, outputFileName) {
	try {
		const commands = await parse(inputFilePath);

		const symbolTable = buildSymbolTable(commands);
	
		const binaryCode = translateToBinary(commands, symbolTable);

		// Write file
		const outputFilePath = path.join(__dirname, 'bin', `${outputFileName ?? 'Prog'}.hack`);
		await fsp.writeFile(outputFilePath, binaryCode);
		console.log("Successfully created the hack file.");
	} catch (err) {
		console.log(err);
	}
}

const inputFilePath = process.argv[2];
const outputFileName = process.argv[3];

if (!inputFilePath) {
	console.error("Usage: node app.js <inputFilePath>");
	process.exit(1);
}

assemble(inputFilePath, outputFileName);
