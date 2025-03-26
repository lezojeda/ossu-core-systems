function translateCommand(type, arg1, arg2) {
	if (type === "C_ARITHMETIC") {
		return writeArithmetic(arg1);
	} else if (type === "C_PUSH" || type === "C_POP") {
		return writePushPop(type, arg1, arg2);
	}
}

function writeArithmetic(command) {
	if (command === "add") {
		return `@SP // pop first value
M=M-1
A=M
D=M
@SP // pop second value
M=M-1
A=M
M=D+M // sum and store
@SP
M=M+1`;
	}
}

function writePushPop(command, segment, index) {
	if (command === "C_PUSH") {
		if (segment === "constant")
			return `@${index}
D=A
// RAM[SP]=D
@SP
A=M
M=D
// SP++
@SP
M=M+1`;
	}
}

module.exports = { translateCommand };
