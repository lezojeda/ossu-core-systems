const fs = require("fs");

/**
 * readVMfile - reads a VM language file line by line and parses it by removing white space and comments and returning them as commands in an array of strings.
 *
 * @param {string} path- to the input file with the VM code to be read.
 * @returns {Promise<string[]>} A promise that resolves to an array containing all parsed lines from the file
 */
function readVMfile(path) {
	const content = fs.readFileSync(path, "utf8");
	return content
		.split("\n")
		.map(line => line.split("//")[0].trim())
		.filter(line => line);
}

/**
 * getCommandType - returns the type of the VM command. C_ARITHMETIC is returned for all the arithmetic commands
 *
 * @param {string} VMcommand
 * @returns {string} the type of the VM command
 */
function getCommandType() {
	return "C_ARITHMETIC";
}

/**
 * arg1 - return the first argument of the command
 * in the case of C_ARITHMETIC the command itself is returned
 * should not be called for C_RETURN commands
 *
 * @param {string} VMcommand
 * @returns {string} the first argument of the command
 */
function arg1() {
	return "";
}

/**
 * arg2 - return the second argument of the command
 * should be called only if the current command is C_PUSH, C_POP, C_FUNCTION or C_CALL
 *
 * @param {string} VMcommand
 * @returns {string} the second argument of the command
 */
function arg2() {
	return "";
}

module.exports = { readVMfile };
