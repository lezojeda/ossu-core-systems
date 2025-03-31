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

		files.forEach(file => {
			if (path.extname(file) !== ".vm") return;

			const fileBaseName = path.basename(file, ".vm");

			const fullPath = path.join(inputPath, file);
			translateVMfile(fullPath, fileBaseName);
		});
	});
} else {
	const fileBaseName = path.basename(inputPath, ".vm");
	translateVMfile(inputPath, fileBaseName);
}

function translateVMfile(file, fileBaseName) {
	const hackCode = readVMfile(file)
		.map(parseCommand)
		.map((command, index) => translateCommand(command, index, fileBaseName))
		.join("\n");
	const outputFilePath = file.replace(".vm", ".asm");
	fs.writeFileSync(outputFilePath, hackCode, "utf8");
}
