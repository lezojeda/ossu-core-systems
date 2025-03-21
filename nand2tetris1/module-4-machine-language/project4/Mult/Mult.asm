// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/4/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
// The algorithm is based on repetitive addition.

// Reset RAM[2] to 0
@R2
M=0

//// Get value from RAM[0] and decrease by 1
// Store RAM[0] address in A
@R0

// Store value at RAM[0] in D
D=M

// Set RAM[0] to D - 1
M=D-1

// If R0 <= 0, jump to END (result stays 0)
@END
D;JLE

(LOOP)
// For each multiplication:

// Add R1 + R1 and store value in R2
@R1
D=M

// If R1 <=, jump to END (result stays 0)
@END
D;JLE

@R2
M=D+M

// Decrease R0 by 1
@R0
D=M
M=D-1

// If R0 still != 0 continue multiplying
@LOOP
D;JNE

(END)
// End program (infinite loop)
 @END
 0;JMP