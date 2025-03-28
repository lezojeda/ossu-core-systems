@1
D=A
// RAM[SP]=D
@SP
A=M
M=D
// SP++
@SP
M=M+1
@3
D=A
// RAM[SP]=D
@SP
A=M
M=D
// SP++
@SP
M=M+1
// push local i
@LCL
D=M
@0
D=D+A
A=D
D=M

// RAM[SP] <- RAM[addr]
@SP
A=M
M=D

// SP++
@SP
M=M+1