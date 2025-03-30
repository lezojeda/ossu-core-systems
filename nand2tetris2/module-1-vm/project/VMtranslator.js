const { readVMfile, parseCommand } = require("./src/parser");
const { translateCommand } = require("./src/codeWriter");
const fs = require("fs");
const path = require("path");

const inputPath = process.argv[2];

if (!inputPath) {
	console.error("Usage: node VMtranslator.js <inputFilePath>");
	process.exit(1);
}

if (fs.lstatSync(inputPath).isDirectory()) {
	fs.readdir(inputPath, (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			process.exit(1);
		}

		files.forEach((file, index) => {
			if (path.extname(file) !== ".vm") return;

			translateVMfile(path.join(inputPath, file));
		});
	});
} else {
	translateVMfile(inputPath);
}

function translateVMfile(inputFilePath) {
	const hackCode = readVMfile(inputFilePath).map(parseCommand).map(translateCommand).join("\n");

	const outputFilePath = inputFilePath.replace(".vm", ".asm");
	fs.writeFileSync(outputFilePath, hackCode, "utf8");
}
