@256
D=A
@SP
M=D
// call Sys.init 0
// save the return address
@Sys.init$ret.1
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
@Sys.init
0;JMP
(Sys.init$ret.1)

	





// function Class1.set 0
(Class1.set)


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
// pop static 0
@SP
M=M-1
A=M
D=M
@Class1.0
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
// pop static 1
@SP
M=M-1
A=M
D=M
@Class1.1
M=D
@0
D=A
@SP
A=M
M=D
@SP
M=M+1
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



// function Class1.get 0
(Class1.get)


// push static 0
@Class1.0
D=M
@SP
A=M
M=D
@SP
M=M+1
// push static 1
@Class1.1
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






// function Class2.set 0
(Class2.set)


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
// pop static 0
@SP
M=M-1
A=M
D=M
@Class2.0
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
// pop static 1
@SP
M=M-1
A=M
D=M
@Class2.1
M=D
@0
D=A
@SP
A=M
M=D
@SP
M=M+1
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



// function Class2.get 0
(Class2.get)


// push static 0
@Class2.0
D=M
@SP
A=M
M=D
@SP
M=M+1
// push static 1
@Class2.1
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








// function Sys.init 0
(Sys.init)


@6
D=A
@SP
A=M
M=D
@SP
M=M+1
@8
D=A
@SP
A=M
M=D
@SP
M=M+1
// call Class1.set 2
// save the return address
@Class1.set$ret.11
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
@2
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
@Class1.set
0;JMP
(Class1.set$ret.11)

// pop temp 0
@5
D=A
@0
D=D+A
@addr_12
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_12
A=M
M=D
@23
D=A
@SP
A=M
M=D
@SP
M=M+1
@15
D=A
@SP
A=M
M=D
@SP
M=M+1
// call Class2.set 2
// save the return address
@Class2.set$ret.15
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
@2
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
@Class2.set
0;JMP
(Class2.set$ret.15)

// pop temp 0
@5
D=A
@0
D=D+A
@addr_16
M=D
// SP--
@SP
M=M-1
A=M
D=M
// RAM[addr] <- RAM[SP]
@addr_16
A=M
M=D
// call Class1.get 0
// save the return address
@Class1.get$ret.17
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
@Class1.get
0;JMP
(Class1.get$ret.17)

// call Class2.get 0
// save the return address
@Class2.get$ret.18
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
@Class2.get
0;JMP
(Class2.get$ret.18)

// label END
(END)
// goto END
@END
0;JMP