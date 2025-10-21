1. With these parameters we're not initializing to dx to 1 or greater although the readme says so. So it starts
as 0 and gets reduced to -1. It doesn't loop since at the `jgte .top` instruction it evaluates to false and continues
to the `halt` instruction.

```
    0 
    0 1000 sub  $1,%dx
    -1 1001 test $0,%dx
    -1 1002 jgte .top
    -1 1003 halt
```

2. Using `-a` we are now initializing the registers to 3. %dx will see values 3, 2, 1, 0 and -1 until halting for each thread. The presence of multiple threads does not affect the calculations since each thread
handles its registers separately so there's no race in this code.

3. No, the interrupt frequency doesn't change anything. Threads still are not accessing any shared state that could lead to a race condition.

4. • Load Memory[2000] (0) → %ax = 0
• Add 1 → %ax = 1  
• Store %ax → Memory[2000] = 1
• Subtract 1 from %bx → %bx = -1
• Test: %bx (-1) vs 0 → condition false
• No jump, program halts
• Final: Memory[2000] = 1, %ax = 1, %bx = -1

So `value` is 0 and 1 throughout the program.

5. Each thread loops 3 times because we initialize %bx to 3 and in the code we subtract 1 until %bx value is not greater than 0.

The final value of `value` without interruptions like in this case will be 6 since each thread increases it by 3. On every loop it moves the value in memory to %ax, increases it, puts it back in 2000 and then loops using the %bx register.

6.

>Can you tell by looking at the
thread interleaving what the final value of value will be? Does the
timing of the interrupt matter?

I can tell by looking at the output without -c but I notice that it leads to unpredictable results depending on where the interrupt happens. So yes, the timing of the interrupt matters.

>Where can it safely occur? Where
not? In other words, where is the critical section exactly?

If the interrupt happens after %ax has been saved to 2000 we always get the final expected value of 2 (two threads increasing the value by 1 in one loop each). If it happens before the first thread adds 1 to `value` but that has already been done by the second thread so `value` stays at 1.

The critical section is:

```
mov 2000, %ax  # get 'value' at address 2000
add $1, %ax    # increment it
mov %ax, 2000  # store it back
```

7. Using `-i 1` means we interrupt after one instruction so we're interrupting before %ax increased is saved so it won't work. With `-i 2` it doesn't work either since we still don't move the value back to `value` after adding.

Only with values greater than 3 for `-i` we get the correct answer which makes sense since our atomic instruction consists of 3 instructions: `mov 2000, %ax`, `add $1, %ax` and `mov %ax, 2000`.

8. Interrupt intervals that are a multiple of 3 result in the correct outcome of 200 and also for any > 600. This is because we need at least 3 continuous instructions to safely save the updated value in register in memory. And > 600 since with `bx=100` each thread completes the entire program with 300 instructions (300x2 = 600, interrupt happens after thread 1 finished execution).

9. Thread 0 sets location 2000 to 1 and then thread 1 sets %cx to 1, since `jne .waiter` evaluates to false it continues and halts.

The value at 2000 is being written by thread 0 but only read by thread 1. Its final value will always be 1 in this case. It acts as a synchronization primitive. The waiter thread (1) loops until 2000 is 1 and the signaller thread (1) signals that is safe to continue by setting 2000 to 1.

10. Thread 0 now is the waiter and thread 1 the signaller. The first one loops many times until an interrupt makes thread 1 execute which sets 2000 to 1 and when thread 0 resumes it sets %cx to 1 and finishes execution.

Changing the interrupt interval would change the trace outcome in terms of how many loops thread 0 goes by until thread 1 can signal and let thread 0 halt. With higher interrupt values thread 0 will cycle a long time until thread 1 can signal.

No, it's not efficiently using the CPU.