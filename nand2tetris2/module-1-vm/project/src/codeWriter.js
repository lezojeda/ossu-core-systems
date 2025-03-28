function translateCommand(command, index) {
	const {type, arg1, arg2} = command;

	if (type === "C_ARITHMETIC") {
		return writeArithmetic(arg1, index);
	} else if (type === "C_PUSH" || type === "C_POP") {
		return writePushPop(type, arg1, arg2, index);
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

function writePushPop(command, segment, index, line) {
	// Mapping of logical segments to their assembly memory references
	const segmentMap = {
		local: "LCL",
		argument: "ARG",
		this: "THIS",
		that: "THAT",
	};

	switch (command) {
		case "C_PUSH":
			// Special case for constant
			if (segment === "constant") {
				return `@${index}
D=A
@SP
A=M
M=D
@SP
M=M+1`;
			}

			if (segmentMap[segment]) {
				return `// push ${segment} ${index}
@${segmentMap[segment]}
D=M
@${index}
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1`;
			}

			if (segment === "temp") {
				return `// push temp ${index}
@5
D=A
@${index}
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1`;
			}
			if (segment === "pointer") {
				const finalSegment = index === '1' ? "THAT" : "THIS";
				return `// push pointer ${index}
@${finalSegment}
D=M
@SP
A=M
M=D
@SP
M=M+1`;
			}

			throw new Error(`Unsupported push segment: ${segment}`);

		case "C_POP":
			if (segmentMap[segment]) {
				return `// pop ${segment} ${index}
@${segmentMap[segment]}
D=M
@${index}
D=D+A
@addr_${line}
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_${line}
A=M
M=D`;
			}
			if (segment === "temp") {
				return `// pop temp ${index}
@5
D=A
@${index}
D=D+A
@addr_${line}
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_${line}
A=M
M=D`;
			}
			if (segment === "pointer") {
				const finalSegment = index === '1' ? "THAT" : "THIS";
				return `// pop pointer ${index}
@SP
M=M-1
A=M
D=M
@${finalSegment}
M=D`;
			}

			throw new Error(`Unsupported pop segment: ${segment}`);

		default:
			throw new Error(`Unsupported command: ${command}`);
	}
}

module.exports = { translateCommand };
