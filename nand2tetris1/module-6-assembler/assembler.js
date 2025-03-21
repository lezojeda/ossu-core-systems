const fsp = require("node:fs/promises");
const path = require("node:path");
const { parse } = require("./parser");
const { translateToBinary } = require("./code");

/**
 * assemble - Creates a 'Prog.hack' representing the translated Hack machine code from the given Hack assembly program.
 *
 * @param {string} program - A string representing a hack assembly program.
 * @returns {void} - Does not return a value.
 * @throws Will log an error message if file creation fails.
 * @assumes The input is always valid.
 */
async function assemble(program) {
	try {
		const assemblyCode = await parse(program);
		
		// 2. Code module: For each field, generate the corresponding bits in the machine language.
		const binaryCode = translateToBinary(assemblyCode);
	
		// 3. Symbol table module: Replace all symbolic references (if any) with numeric addresses of memory locations.
		// 4. Assemble the binary codes into a complete machine instruction

		// Write file
		const outputFilePath = path.join(__dirname, "Prog.hack");
		await fsp.writeFile(outputFilePath, binaryCode);
		console.log("Successfully created the hack file.");
	} catch (err) {
		console.log(err);
	}
}

const inputFilePath = process.argv[2];

if (!inputFilePath) {
	console.error("Usage: node app.js <inputFilePath>");
	process.exit(1);
}

assemble(inputFilePath);
