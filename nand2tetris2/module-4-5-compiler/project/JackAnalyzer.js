const { tokenize } = require("./JackTokenizer");
const path = require("path");
const fs = require("fs");

const source = process.argv[2];

if (!source) {
	console.error(
		"Source parameter missing. Usage: node JackAnalyzer.js <source> where source is a file or directory"
	);
	process.exit(1);
}

if (fs.lstatSync(source).isDirectory()) {
	fs.readdir(source, (err, files) => {
		if (err) {
			console.error("Could not list the directory.");
			process.exit(1);
		}

		let finalFile = "";

		files.forEach(file => {
			if (path.extname(file) !== ".jack") return;

			finalFile += tokenize(file);
		});

		fs.writeFileSync(path.join(source, "final.vm"), finalFile);
	});
} else {
	const fileTokenized = tokenize(source);
	fs.writeFileSync(source.replace(".jack", ".vm"), fileTokenized);
}
d