@10
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop local i
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
@21
D=A
@SP
A=M
M=D
@SP
M=M+1
@22
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop argument i
@ARG
D=M
@2
D=D+A
@addr_4
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_4
A=M
M=D
// pop argument i
@ARG
D=M
@1
D=D+A
@addr_5
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_5
A=M
M=D
@36
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop this i
@THIS
D=M
@6
D=D+A
@addr_7
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_7
A=M
M=D
@42
D=A
@SP
A=M
M=D
@SP
M=M+1
@45
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop that i
@THAT
D=M
@5
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
// pop that i
@THAT
D=M
@2
D=D+A
@addr_11
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_11
A=M
M=D
@510
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop temp i
@5
D=A
@6
D=D+A
@addr_13
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_13
A=M
M=D
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
// push that i
@THAT
D=M
@5
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
// add
@SP
M=M-1
A=M
D=M
A=A-1
D=D+M
M=D
// push argument i
@ARG
D=M
@1
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
// sub
@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
M=D
// push this i
@THIS
D=M
@6
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
// push this i
@THIS
D=M
@6
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
// add
@SP
M=M-1
A=M
D=M
A=A-1
D=D+M
M=D
// sub
@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
M=D
// push temp i
@5
D=A
@6
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
// add
@SP
M=M-1
A=M
D=M
A=A-1
D=D+M
M=D