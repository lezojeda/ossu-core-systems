const { tokenize } = require("./JackTokenizer");
const { parseToXML } = require("./CompilationEngine");
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
        const finalFile = parseToXML(tokenize(filePath));
        fs.writeFileSync(filePath.replace(".jack", ".vm"), finalFile);
    } catch (err) {
        handleError(`Error processing file ${filePath}:`, err);
    }
}

function processSource(sourcePath) {
    try {
        if (fs.lstatSync(sourcePath).isDirectory()) {
            fs.readdir(sourcePath, (err, files) => {
                if (err) {
                    handleError("Could not list the directory.", err);
                    process.exit(1);
                }

                files.forEach(file => {
                    if (path.extname(file) === ".jack") {
                        processFile(path.join(sourcePath, file));
                    }
                });
            });
        } else {
            processFile(sourcePath);
        }
    } catch (err) {
        handleError("Unexpected error:", err);
    }
}

processSource(source);
