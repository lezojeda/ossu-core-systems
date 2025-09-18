## 1. 

For two jobs with length of 25 and options

- Quantum = 10
- Allotment = 1 (one quantum per priority level)
- 2 queues (priorities 1 and 0)

1. Job 1 is run for 10 time units in priority 1
2. Job 1 consumes one quanta and gets demoted to priority 0
3. Job 2 is run for 10 time units in priority 1
3. Job 2 consumes one quanta and gets demoted to priority 0
4. Job 1 is run for 10 time units in priority 0, 5 left
5. Job 2 is run for 10 time units in priority 0, 5 left
5. Job 1 is run for 5 time units and finishes
6. Same for job 2

## 2. 

### Example 1: A Single Long-Running Job

`./mlfq.py -l 0,200,0`

We don't need any extra options since it uses 3 queues and a 10 time slice length as default values.

### Example 2: Along Came A Short Job
`./mlfq.py -l 0,200,0:100,20,0`

The second job is added using `100,20,0`. Start time of 100 and run for 20 time units.
### Example 3
`./mlfq.py -l 0,200,0:50,20,1`
### Example 4: Three jobs without priority boost
`./mlfq.py -l 0,200,0:100,50,5:105,50,5 -S`

Three jobs where the first one is CPU intensive and the other two issue I/O repeatedly. Like in the plot, the CPU intensive job yields the CPU when the first one arrives and can only continue to run after jobs 2 and 3 are done.

-S flag makes sure jobs stay in the same priority queue after issuing I/O
### Example 5: Three jobs with priority boost
`./mlfq.py -l 0,200,0:100,50,5:105,50,5 -S -B 100`
### Example 6: Without gaming tolerance
`./mlfq.py -l 0,200,0:100,100,9 -S -i 1 -c`

The second process issues very short I/O requests (`-i 1`) and with the `-S` flag we make sure it always stays in priority queue 2 hence hogging the CPU. Job 0 runs on brief bursts and can use the CPU for considerable time only after 1 finishes.
### Example 7: With gaming tolerance
Same as 6 without the `--stay` flag