function writeBootstrapCode() {
	return `@256
D=A
@SP
M=D
${writeCall("Sys.init", 0, 1)}
	`;
}

function translateCommand(command, index, filename) {
	const { type, arg1, arg2 } = command;

	switch (type) {
		case "C_ARITHMETIC":
			return writeArithmetic(arg1, index);
		case "C_PUSH":
		case "C_POP":
			return writePushPop(command, index, filename);
		case "C_LABEL":
			return writeLabel(arg1);
		case "C_GO_TO":
			return writeGoTo(arg1);
		case "C_IF":
			return writeIf(arg1);
		case "C_CALL":
			return writeCall(arg1, arg2, index);
		case "C_FUNCTION":
			return writeFunction(arg1, arg2);
		case "C_RETURN":
			return writeReturn();
		default:
			throw new Error(`Unknown command type: ${type}`);
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

function writePushPop(command, line, filename) {
	const { arg1: segment, arg2: index, type } = command;
	// Mapping of logical segments to their assembly memory references
	const segmentMap = {
		local: "LCL",
		argument: "ARG",
		this: "THIS",
		that: "THAT",
	};

	switch (type) {
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
				const finalSegment = index === "1" ? "THAT" : "THIS";
				return `// push pointer ${index}
@${finalSegment}
D=M
@SP
A=M
M=D
@SP
M=M+1`;
			}
			if (segment === "static") {
				return `// push static ${index}
@${filename}.${index}
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
				const finalSegment = index === "1" ? "THAT" : "THIS";
				return `// pop pointer ${index}
@SP
M=M-1
A=M
D=M
@${finalSegment}
M=D`;
			}

			if (segment === "static") {
				return `// pop static ${index}
@SP
M=M-1
A=M
D=M
@${filename}.${index}
M=D`;
			}

			throw new Error(`Unsupported pop segment: ${segment}`);

		default:
			throw new Error(`Unsupported command: ${command}`);
	}
}

function writeLabel(label) {
	return `// label ${label}
(${label})`;
}

function writeGoTo(label) {
	return `// goto ${label}
@${label}
0;JMP`;
}

function writeIf(label) {
	return `// if-goto ${label}
@SP
M=M-1
@SP
A=M
D=M
@${label}
D;JNE`;
}

function writeCall(functionName, nArgs, lineNumber) {
	const returnAddress = `${functionName}$ret.${lineNumber}`;
	return `// call ${functionName} ${nArgs}
// save the return address
@${returnAddress}
D=A
@SP
A=M
M=D
@SP
M=M+1
// save the caller's segment pointers
@LCL
D=M
@SP
A=M
M=D
@SP
M=M+1
// push ARG
@ARG
D=M
@SP
A=M
M=D
@SP
M=M+1
// push THIS
@THIS
D=M
@SP
A=M
M=D
@SP
M=M+1
// push THAT
@THAT
D=M
@SP
A=M
M=D
@SP
M=M+1
// reposition ARG 
@SP
D=M
@${nArgs}
D=D-A
@5
D=D-A
@ARG
M=D
// reposition LCL
@SP
D=M
@LCL
M=D
// go to execute the callee's code
@${functionName}
0;JMP
(${returnAddress})
`;
}

function writeFunction(functionName, nVars) {
	const localVariablesCode = `@SP
A=M
M=0
@SP
M=M+1\n`.repeat(nVars);

	return `// function ${functionName} ${nVars}
(${functionName})
${localVariablesCode}
`;
}

function writeReturn() {
	return `// return
// gets the address at the frame’s end
@LCL
D=M
@frame
M=D

// gets the return address
@5
A=D-A
D=M
@return_address
M=D

// puts the return value for the caller
@SP
M=M-1
A=M
D=M
@ARG
A=M
M=D

// restore the caller’s segment pointers
// repositions SP
@ARG
D=M+1
@SP
M=D

// restore THAT
@frame
D=M-1
A=D
D=M
@THAT
M=D

// restore THIS
@2
D=A
@frame
D=M-D
A=D
D=M
@THIS
M=D

// restore ARG
@3
D=A
@frame
D=M-D
A=D
D=M
@ARG
M=D

// restore LCL
@4
D=A
@frame
D=M-D
A=D
D=M
@LCL
M=D

// jump to the return address
@return_address
A=M
0;JMP
`;
}

module.exports = { translateCommand, writeBootstrapCode };
