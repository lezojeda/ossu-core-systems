const { getSymbol, getCommandType } = require("./common");

/**
 * buildSymbolTable - Uses the base symbolic table and builds an extended one with the correspondence between
 * labels and numeric memory addresses
 *
 * @param {string} commands - A string representing the hack assembly program's file path.
 * @returns {Object.<string, number>} - The symbol table updated with labels used in the assembly code
 */
const buildSymbolTable = (commands) => {
	const symbolTable = { ...baseTable };
	let ROM = 0;

	for (let command of commands) {
		const commandType = getCommandType(command);

		if (commandType === "A_COMMAND" || commandType === "C_COMMAND") {
			ROM += 1;
		} else {
			const symbol = getSymbol(command);
			symbolTable[symbol] = ROM;
		}
	}

	return symbolTable;
};

const baseTable = {
	SP: 0,
	LCL: 1,
	ARG: 2,
	THIS: 3,
	THAT: 4,
	R0: 0,
	R1: 1,
	R2: 2,
	R3: 3,
	R4: 4,
	R5: 5,
	R6: 6,
	R7: 7,
	R8: 8,
	R9: 9,
	R10: 10,
	R11: 11,
	R12: 12,
	R13: 13,
	R14: 14,
	R15: 15,
	SCREEN: 16384,
	KBD: 24576,
};

module.exports = { buildSymbolTable };
