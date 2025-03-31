@0
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop local 0
@LCL
D=M
@0
D=D+A
@addr_1
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_1
A=M
M=D
// label LOOP
(LOOP)
// push argument 0
@ARG
D=M
@0
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push local 0
@LCL
D=M
@0
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// add
@SP
M=M-1
A=M
D=M
A=A-1
D=D+M
M=D
// pop local 0
@LCL
D=M
@0
D=D+A
@addr_6
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_6
A=M
M=D
// push argument 0
@ARG
D=M
@0
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
@1
D=A
@SP
A=M
M=D
@SP
M=M+1
// sub
@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
M=D
// pop argument 0
@ARG
D=M
@0
D=D+A
@addr_10
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_10
A=M
M=D
// push argument 0
@ARG
D=M
@0
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// if-goto LOOP
@SP
M=M-1
A=M
D=M
@LOOP
D;JNE
// push local 0
@LCL
D=M
@0
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1