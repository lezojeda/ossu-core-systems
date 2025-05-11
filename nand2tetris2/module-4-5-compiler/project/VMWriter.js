function writePush(segment, index) {
	return `push ${segment} ${index}\n`;
}

function writePop(segment, index) {
	return `pop ${segment} ${index}\n`;
}

function writeArithmetic(command) {
    switch (command) {
        case "+": return "add\n";
        case "-": return "sub\n";
        case "*": return "call Math.multiply 2\n";
        case "/": return "call Math.divide 2\n";
        case "&": return "and\n";
        case "|": return "or\n";
        case "<": return "lt\n";
        case ">": return "gt\n";
        case "=": return "eq\n";
        case "~": return "not\n";
        case "not": return "not\n";
        case "neg": return "neg\n";
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

function writeCall(f, nArgs) {
	return `call ${f} ${nArgs}\n`;
}

function writeFunction(name, nLocals) {
	return `function ${name} ${nLocals}\n`;
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
	writeFunction,
};
