function writePush(segment, index) {
	return `push ${segment} ${index}`;
}

function writePop(segment, index) {
	return `pop ${segment} ${index}`;
}

function writeArithmetic(command) {
	const commands = ["add", "sub", "neg", "eq", "gt", "lt", "and", "or", "not"];

	if (!commands.includes(command)) {
		throw new Error(`Invalid command. Must be one of ${commands.join(", ")}`);
	}

	return command;
}

function writeLabel() {
	return "label";
}

function writeGoto() {
	return "goto";
}

function writeIf() {
	return "if";
}

function writeReturn() {
	return "return";
}

module.exports = {
	writePush,
	writePop,
	writeArithmetic,
	writeLabel,
	writeGoto,
	writeIf,
	writeReturn,
};
