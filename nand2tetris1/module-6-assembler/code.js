/**
 * translateToBinary - Translates Hack assembly language mnemonics into binary codes.
 *
 * @param {string} mnemonic - The Hack assembly language mnemonic to be translated.
 * @returns {string} - The binary representation of the given mnemonic.
 */
function translateToBinary(mnemonic) {
	let binaryCode = "";
	for (let line of mnemonic) {
		const commandType = getCommandType(line);

		if (commandType === "A_COMMAND" || commandType === "L_COMMAND") {
			const symbol = getSymbol(line);
			const binary = convertToBinary(symbol).padStart(16, "0");
			binaryCode += `${binary}\n`;
		} else {
			const { comp, dest, jump } = parseCInstruction(line);

			const binComp = convertCompToBinary(comp);
			const binDest = convertDestToBinary(dest);
			const binJmp = convertJmpToBinary(jump);

			binaryCode += `111${binComp}${binDest}${binJmp}\n`;
		}
	}

	return binaryCode;
}

/**
 * Determines type of Hack assembly language command
 *
 * @param {string} command - Hack assembly language command.
 * @returns {'A_COMMAND'|'C_COMMAND'|'L_COMMAND'} The type of the command
 */
function getCommandType(command) {
	if (command.startsWith("@")) {
		return "A_COMMAND";
	} else if (command.includes("=")) {
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

/**
 * Converts a command to its binary representation
 *
 * @param {string} command - Hack Assembly A or L type command.
 * @returns {ReturnType} The binary code of an A or L mnemonic
 */
function convertToBinary(command) {
	return parseInt(command).toString(2);
}

function parseCInstruction(line) {
	const regex = /^(?:([AMD]+)=)?([^;]+)(?:;(.+))?$/;
	const match = line.match(regex);

	if (match) {
		const [_, dest, comp, jump] = match;
		return {
			dest: dest || null,
			comp: comp,
			jump: jump || null,
		};
	}

	return null;
}

function convertDestToBinary(dest) {
	if (!dest) return "000";

	const destTable = {
		M: "001",
		D: "010",
		MD: "011",
		A: "100",
		AM: "101",
		AD: "110",
		AMD: "111",
	};

	return destTable[dest];
}

function convertCompToBinary(comp) {
	const compTable = {
		// a=0 instructions
		0: "0101010",
		1: "0111111",
		"-1": "0111010",
		D: "0001100",
		A: "0110000",
		"!D": "0001101",
		"!A": "0110001",
		"-D": "0001111",
		"-A": "0110011",
		"D+1": "0011111",
		"A+1": "0110111",
		"D-1": "0001110",
		"A-1": "0110010",
		"D+A": "0000010",
		"D-A": "0010011",
		"A-D": "0000111",
		"D&A": "0000000",
		"D|A": "0010101",

		// a=1 instructions (M instead of A)
		M: "1110000",
		"!M": "1110001",
		"-M": "1110011",
		"M+1": "1110111",
		"M-1": "1110010",
		"D+M": "1000010",
		"D-M": "1010011",
		"M-D": "1000111",
		"D&M": "1000000",
		"D|M": "1010101",
	};

	return compTable[comp];
}

function convertJmpToBinary(jmp) {
	if (!jmp) return "000";

	const jmpTable = {
		JGT: "000",
		JEQ: "010",
		JGE: "011",
		JLT: "100",
		JNE: "101",
		JLE: "110",
		JMP: "111",
	};

	return jmpTable[jmp];
}

module.exports = { translateToBinary };
