function writePush(segment, index) {
	return `push ${segment} ${index}\n`;
}

function writePop(segment, index) {
	return `pop ${segment} ${index}\n`;
}

function writeArithmetic(command) {
	switch (command) {
		case "+":
			return "add\n";
		case "-":
			return "sub\n";
		case "*":
			return "call Math.multiply\n";
		case "/":
			return "call Math.divide\n";
		case "&":
			return "and\n";
		case "|":
			return "or\n";
		case "<":
			return "lt\n";
		case ">":
			return "gt\n";
		case "=":
			return "eq\n";
	}
}

function writeLabel() {
	return "label\n";
}

function writeGoto() {
	return "goto\n";
}

function writeIf() {
	return "if\n";
}

function writeReturn() {
	return "return\n";
}

function writeCall(f) {
	return `call ${f}\n`;
}

module.exports = {
	writePush,
	writePop,
	writeArithmetic,
	writeLabel,
	writeGoto,
	writeIf,
	writeReturn,
	writeCall,
};
