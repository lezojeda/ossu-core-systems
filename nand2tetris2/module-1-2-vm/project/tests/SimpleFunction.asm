// function SimpleFunction.test 2
(SimpleFunction.SimpleFunction.test)
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
// add
@SP
M=M-1
A=M
D=M
A=A-1
D=D+M
M=D
// not
@SP
A=M-1
M=!M
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
// add
@SP
M=M-1
A=M
D=M
A=A-1
D=D+M
M=D
// push argument 1
@ARG
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
// sub
@SP
M=M-1
A=M
D=M
A=A-1
D=M-D
M=D
// return
// gets the address at the frame’s end
@LCL
D=M
@frame
M=D

// gets the return address
@5
D=D-A
A=D
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
