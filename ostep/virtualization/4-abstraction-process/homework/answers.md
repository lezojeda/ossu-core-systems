1. The CPU utilization should be 100%. This is because we are simulating two processes with 5 instructions each with a 100% chance of each instruction being a CPU one according to the program specifications in the README.
2. Since I/O instructions take 5 time units (1 for running and 4 from waiting) the total time will be 10 units like in 1.
3. My supposition is that it shouldn't, before checking with -c and -p.

But after checking with -c and -p I see it takes 4 less units since we first fire the I/O instruction and while it waits we can run the one that only uses the CPU, once this once is done we complete the other one. In 2. we ran the CPU process while the I/O process was ready and sat idly. It started waiting only after the CPU one finished.

4. If we use SWITCH_ON_END it waits until the I/O process is done waiting and only then starts the CPU one hence taking the same time as 2. and longer than the one in 3. where we took advantage of running a process while the other waits.

5. We return to what happened in 3., we have a Total Time of 6 units because we switch to the CPU process while the I/O one waits.
6. When we use IO_RUN_LATER immediately after the first process issues an I/O instruction we switch to the second one that only uses the CPU, after this one is done we switch to the third and then the fourth one, both CPU-exclusive ones too.

Only after this last one ends we return to the first process which has another I/O instruction so that one is issued and the system is idle until it finishes, it issues a last I/O instruction and the program then ends. Under this scenario we had a considerable amount of time where the program sat idle.

If we use IO_RUN_IMMEDIATE instead, the first process issues the I/O instruction, we switch to the second CPU process but switch back to the first one once the first I/O instruction is done and start the second one, returning to the second CPU process, this is repeated several times leading to less CPU idle time and a less total execution time.

7. Answered in 6.