const { readVMfile } = require("./src/parser");

const inputFilePath = process.argv[2];

if (!inputFilePath) {
	console.error("Usage: node VMtranslator.js <inputFilePath>");
	process.exit(1);
}

translate(inputFilePath);

function translate(path) {
	// Pipe the line through:
	// 1. Cleaning/preprocessing
	const VMfile = readVMfile(path);
	// 2. Command classification
	// 3. Argument extraction
	// 4. Translation to assembly
}
