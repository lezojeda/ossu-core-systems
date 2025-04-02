// function Sys.init 0
(Sys.init)


@4000
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop pointer 0
@SP
M=M-1
A=M
D=M
@THIS
M=D
@5000
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop pointer 1
@SP
M=M-1
A=M
D=M
@THAT
M=D
// call Sys.main 0
// save the return address
@Sys.main$ret.5
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
@0
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
@Sys.main
0;JMP
(Sys.main$ret.5)

// pop temp 1
@5
D=A
@1
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
// label LOOP
(LOOP)
// goto LOOP
@LOOP
0;JMP
// function Sys.main 5
(Sys.main)
@SP
A=M
M=0
@SP
M=M+1
@SP
A=M
M=0
@SP
M=M+1
@SP
A=M
M=0
@SP
M=M+1
@SP
A=M
M=0
@SP
M=M+1
@SP
A=M
M=0
@SP
M=M+1


@4001
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop pointer 0
@SP
M=M-1
A=M
D=M
@THIS
M=D
@5001
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop pointer 1
@SP
M=M-1
A=M
D=M
@THAT
M=D
@200
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop local 1
@LCL
D=M
@1
D=D+A
@addr_15
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_15
A=M
M=D
@40
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop local 2
@LCL
D=M
@2
D=D+A
@addr_17
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_17
A=M
M=D
@6
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop local 3
@LCL
D=M
@3
D=D+A
@addr_19
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_19
A=M
M=D
@123
D=A
@SP
A=M
M=D
@SP
M=M+1
// call Sys.add12 1
// save the return address
@Sys.add12$ret.21
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
@1
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
@Sys.add12
0;JMP
(Sys.add12$ret.21)

// pop temp 0
@5
D=A
@0
D=D+A
@addr_22
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_22
A=M
M=D
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
// push local 1
@LCL
D=M
@1
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push local 2
@LCL
D=M
@2
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push local 3
@LCL
D=M
@3
D=D+A
A=D
D=M
@SP
A=M
M=D
@SP
M=M+1
// push local 4
@LCL
D=M
@4
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
// add
@SP
M=M-1
A=M
D=M
A=A-1
D=D+M
M=D
// add
@SP
M=M-1
A=M
D=M
A=A-1
D=D+M
M=D
// add
@SP
M=M-1
A=M
D=M
A=A-1
D=D+M
M=D
// return
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

// function Sys.add12 0
(Sys.add12)


@4002
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop pointer 0
@SP
M=M-1
A=M
D=M
@THIS
M=D
@5002
D=A
@SP
A=M
M=D
@SP
M=M+1
// pop pointer 1
@SP
M=M-1
A=M
D=M
@THAT
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
@12
D=A
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
// return
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
