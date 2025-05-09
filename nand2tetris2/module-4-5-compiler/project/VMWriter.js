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
		case "not":
			return "not\n"
	}
}

function writeLabel(label) {
	return `label ${label}\n`;
}

function writeGoto(label) {
	return `goto ${label}\n`;
}

function writeIf(label) {
	return `if-goto ${label}\n`;
}

function writeReturn() {
	return "return\n";
}

function writeCall(f, n) {
	return `call ${f} ${n}\n`;
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
