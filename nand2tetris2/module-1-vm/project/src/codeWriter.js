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
			return `// add
@SP
M=M-1
A=M
D=M
A=A-1
D=D+M
M=D`;
		case "sub":
			return `// sub
@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
M=D`;
		case "eq":
			return `// eq
@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
@EQ_${index}
D;JEQ
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
		case "lt":
			return `// lt
@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
@LT_${index}
D;JLT
@SP
A=M-1
M=0
@END_${index}
0;JMP
(LT_${index})
@SP
A=M-1
M=-1
(END_${index})`;
		case "gt":
			return `// gt
@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
@GT_${index}
D;JGT
@SP
A=M-1
M=0
@END_${index}
0;JMP
(GT_${index})
@SP
A=M-1
M=-1
(END_${index})`;
		case "neg":
			return `// neg
@SP
A=M-1
M=-M`;
		case "and":
			return `// and
@SP
M=M-1
A=M
D=M
A=A-1
M=D&M`;
		case "or":
			return `// or
@SP
M=M-1
A=M
D=M
A=A-1
M=D|M`;
		case "not":
			return `// not
@SP
A=M-1
M=!M`;
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
