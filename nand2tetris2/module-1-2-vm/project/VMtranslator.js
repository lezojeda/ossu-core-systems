const { readVMfile, parseCommand } = require("./src/parser");
const { translateCommand, writeBootstrapCode } = require("./src/codeWriter");
const fs = require("fs");
const path = require("path");

const inputPath = process.argv[2];

if (!inputPath) {
	console.error("Input parameter missing. Usage: node VMtranslator.js <inputPath>");
	process.exit(1);
}

if (fs.lstatSync(inputPath).isDirectory()) {
	fs.readdir(inputPath, (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			process.exit(1);
		}

		let finalAsmCode = writeBootstrapCode();

		files.forEach(file => {
			if (path.extname(file) !== ".vm") return;

			const fullPath = path.join(inputPath, file);
			const fileBaseName = path.basename(file, ".vm");

			finalAsmCode += translateVMfile(fullPath, fileBaseName);
		});

		fs.writeFileSync(path.join(inputPath, "final.asm"), finalAsmCode);
	});
} else {
	const filename = inputPath.replace(".vm", ".asm");
	const data = translateVMfile(inputPath, path.basename(inputPath, ".vm"));
	fs.writeFileSync(filename, data);
}

function translateVMfile(path, fileBaseName) {
	let hackAsmCode = readVMfile(path)
		.map(parseCommand)
		.map((command, index) => translateCommand(command, index, fileBaseName))
		.join("\n");

	return hackAsmCode;
}
