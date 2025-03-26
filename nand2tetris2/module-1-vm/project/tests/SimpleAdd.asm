@7
D=A
// RAM[SP]=D
@SP
A=M
M=D
// SP++
@SP
M=M+1
@8
D=A
// RAM[SP]=D
@SP
A=M
M=D
// SP++
@SP
M=M+1
// add
@SP
M=M-1
A=M
D=M
@SP
M=M-1
A=M
M=D+M
@SP
M=M+1