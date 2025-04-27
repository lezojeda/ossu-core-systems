const { readVMfile, parseCommand } = require("./src/parser");
const { translateCommand, writeBootstrapCode } = require("./src/codeWriter");
const fs = require("fs");
const path = require("path");

const source = process.argv[2];

if (!source) {
	console.error("Input parameter missing. Usage: node VMtranslator.js <inputPath>");
	process.exit(1);
}

if (fs.lstatSync(source).isDirectory()) {
	fs.readdir(source, (err, files) => {
		if (err) {
			console.error("Could not list the directory.", err);
			process.exit(1);
		}

		let finalAsmCode = writeBootstrapCode();

		files.forEach(file => {
			if (path.extname(file) !== ".vm") return;

			const fullPath = path.join(source, file);
			const fileBaseName = path.basename(file, ".vm");

			finalAsmCode += translateVMfile(fullPath, fileBaseName);
		});

		fs.writeFileSync(path.join(source, "final.asm"), finalAsmCode);
	});
} else {
	const filename = source.replace(".vm", ".asm");
	const data = translateVMfile(source, path.basename(source, ".vm"));
	fs.writeFileSync(filename, data);
}

function translateVMfile(path, fileBaseName) {
	let hackAsmCode = readVMfile(path)
		.map(parseCommand)
		.map((command, index) => translateCommand(command, index, fileBaseName))
		.join("\n");

	return hackAsmCode;
}
