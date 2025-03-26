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
@SP // pop first value
M=M-1
A=M
D=M
@SP // pop second value
M=M-1
A=M
M=D+M // sum and store
@SP
M=M+1