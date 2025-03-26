@1234
D=A
// RAM[SP]=D
@SP
A=M
M=D
// SP++
@SP
M=M+1
@4321
D=A
// RAM[SP]=D
@SP
A=M
M=D
// SP++
@SP
M=M+1
@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=D&M