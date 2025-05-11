const { tokenize } = require("./JackTokenizer");
const { compile } = require("./CompilationEngine");
const path = require("path");
const fs = require("fs");

const source = process.argv[2];

if (!source) {
	console.error(
		"Source parameter missing. Usage: node JackAnalyzer.js <source> where source is a file or directory"
	);
	process.exit(1);
}

function handleError(message, err) {
	console.error(message, err);
}

function processFile(filePath) {
	try {
		return compile(tokenize(filePath));
	} catch (err) {
		handleError(`Error processing file ${filePath}:`, err);
	}
}

function processSource(sourcePath) {
	try {
		if (fs.lstatSync(sourcePath).isDirectory()) {
			let finalOutput = "";
			const files = fs.readdirSync(sourcePath);

			files.forEach(file => {
				if (path.extname(file) === ".jack") {
					const filePath = path.join(sourcePath, file);
					finalOutput += processFile(filePath);
				}
			});

			const dirName = path.basename(sourcePath);
			const outputPath = path.join(sourcePath, `${dirName}.vm`);
			fs.writeFileSync(outputPath, finalOutput);
		} else {
			const outputPath = sourcePath.replace(/\.jack$/, ".vm");
			fs.writeFileSync(outputPath, processFile(sourcePath));
		}
		console.log("Successfully compiled the source files.");
	} catch (err) {
		handleError("Unexpected error:", err);
	}
}

processSource(source);
