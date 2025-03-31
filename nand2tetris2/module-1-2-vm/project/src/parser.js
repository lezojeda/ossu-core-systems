const fs = require("fs");

/**
 * readVMfile - reads a VM language file line by line and parses it by removing white space and comments and returning them as commands in an array of strings.
 *
 * @param {string} path- to the input file with the VM code to be read.
 * @returns {string[]} An array containing all parsed lines from the file
 */
function readVMfile(path) {
	const content = fs.readFileSync(path, "utf8");
	return content
		.split("\n")
		.map(line => line.split("//")[0].trim())
		.filter(line => line);
}

function parseCommand(VMcommand) {
	const type = getCommandType(VMcommand);
    return {
      type,
      arg1: getArg1(VMcommand, type),
      arg2: getArg2(VMcommand, type)
    };
}

/**
 * getCommandType - returns the type of the VM command. C_ARITHMETIC is returned for all the arithmetic commands
 *
 * @param {string} VMcommand
 * @returns {string} the type of the VM command
 */
function getCommandType(VMcommand) {
	if (VMcommand.startsWith("push")) {
		return "C_PUSH";
	} else if (VMcommand.startsWith("pop")) {
		return "C_POP";
	} else if (VMcommand.startsWith("label")) {
		return "C_LABEL";
	} else if (VMcommand.startsWith("goto")) {
		return "C_GO_TO";
	} else if (VMcommand.startsWith("if")) {
		return "C_IF";
	} else if (VMcommand.startsWith("function")) {
		return "C_RETURN";
	} else if (VMcommand.startsWith("call")) {
		return "C_CALL";
	} else {
		return "C_ARITHMETIC";
	}
}

/**
 * getArg1 - return the first argument of the command
 * in the case of C_ARITHMETIC the command itself is returned
 * should not be called for C_RETURN commands
 *
 * @param {string} VMcommand
 * @returns {string} the first argument of the command
 */
function getArg1(VMcommand, type) {
	if (type === "C_ARITHMETIC") {
		return VMcommand
	} else if (type !== "C_RETURN") {
		return VMcommand.split(" ")[1];
	}
}

/**
 * getArg2 - return the second argument of the command
 * should be called only if the current command is C_PUSH, C_POP, C_FUNCTION or C_CALL
 *
 * @param {string} VMcommand
 * @returns {string} the second argument of the command
 */
function getArg2(VMcommand, type) {
	if (["C_PUSH", "C_POP", "C_FUNCTION", "C_CALL"].includes(type)) {
		return VMcommand.split(" ")[2];
	}
}

module.exports = { readVMfile, parseCommand };
