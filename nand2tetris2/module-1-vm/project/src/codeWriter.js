function translateCommand(type, arg1, arg2, index) {
	if (type === "C_ARITHMETIC") {
		return writeArithmetic(arg1, index);
	} else if (type === "C_PUSH" || type === "C_POP") {
		return writePushPop(type, arg1, arg2);
	}
}

function writeArithmetic(command, index) {
	switch (command) {
		case "add":
			return `@SP // pop first value
M=M-1#
A=M
D=M
@SP // pop second value
M=M-1
A=M
M=D+M // sum and store
@SP
M=M+1`;
		case "sub":
			return `@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=D-M // subtract and store
@SP
M=M+1`;
		case "eq":
			return `
@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
@EQ_${index}
D;JEQ // if they are not equal, set RAM[SP] to 0
@SP
A=M-1
M=0
@END_${index}
0;JMP

(EQ_${index})
@SP // otherwise set RAM[SP] to -1 (all 1s)
A=M-1
M=-1
@END_${index}`;
		case "lt":
			return `@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
@EQ_${index}
D;JLT // if x - y is > 0 then x > y, in that case don't jump
@SP
A=M-1
M=0
@END_${index}
0;JMP
(EQ_${index})
@SP
A=M-1
M=-1
(END_${index})`;
		case "gt":
			return `@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
@EQ_${index}
D;JGT // if x - y is > 0 then x > y, in that case jump
@SP
A=M-1
M=0
@END_${index}
0;JMP
(EQ_${index})
@SP
A=M-1
M=-1
(END_${index})`;
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
