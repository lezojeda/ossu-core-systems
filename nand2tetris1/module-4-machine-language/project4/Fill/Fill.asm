// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/4/Fill.asm

// Runs an infinite loop that listens to the keyboard input. 
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel. When no key is pressed, 
// the screen should be cleared.

// Wait for key press
(LOOP)
    @KBD
    D=M
    @WHITE_SCREEN
    D;JEQ

    @SCREEN
    D=A
    @addr
    M=D  // addr = SCREEN base address

(BLACK_SCREEN)
    @addr
    D=M

    // If addr >= end of SCREEN (16384 + 8192 = 24576), stop
    @24576
    D=D-A
    @LOOP
    D;JGE  

    // Otherwise, fill current pixel
    @addr
    A=M
    M=-1

    // Move to next pixel
    @addr
    M=M+1
    @BLACK_SCREEN
    0;JMP

(WHITE_SCREEN)
    @SCREEN
    D=A
    @addr
    M=D  // addr = SCREEN base address

(CLEAR_SCREEN)
    @addr
    D=M

    // If addr >= end of SCREEN, stop
    @24576
    D=D-A
    @LOOP
    D;JGE

    // Clear current pixel
    @addr
    A=M
    M=0

    // Move to next pixel
    @addr
    M=M+1
    @CLEAR_SCREEN
    0;JMP