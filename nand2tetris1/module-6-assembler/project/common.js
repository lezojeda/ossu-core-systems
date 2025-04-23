/**
 * Determines type of Hack assembly language command
 *
 * @param {string} command - Hack assembly language command.
 * @returns {'A_COMMAND'|'C_COMMAND'|'L_COMMAND'} The type of the command
 */
function getCommandType(command) {
	if (command.startsWith("@")) {
		return "A_COMMAND";
	} else if (command.includes("=") || command.includes(";")) {
		// this smells
		return "C_COMMAND";
	} else {
		return "L_COMMAND";
	}
}

function getSymbol(command) {
	if (command.startsWith("@")) {
		return command.slice(1);
	} else if (command.startsWith("(")) {
		return command.slice(1, -1);
	}
}

module.exports = { getCommandType, getSymbol }