@12
D=A
// RAM[SP]=D
@SP
A=M
M=D
// SP++
@SP
M=M+1
@5
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
M=D-M // subtract and store
@SP
M=M+1