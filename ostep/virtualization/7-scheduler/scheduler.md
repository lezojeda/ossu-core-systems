1.

Using FIFO: Response: 200.00  Turnaround 400.00  Wait 200.00

Using SJF: Response: 200.00  Turnaround 400.00  Wait 200.00

Same values which makes sense since the shortest job first policy has no effect if all jobs have the same length (200)

2. Using -l 300,100,200

FIFO: Response: 233.33  Turnaround 433.33  Wait 233.33

SJF: Response: 133.33  Turnaround 333.33  Wait 133.33

3. Response: 1.00  Turnaround 466.33  Wait 266.33

4. For workloads of the same length, like in 1.

6. It increases, not as much as with FIFO but doesn't stay constant as with RR

FIFO:
300,100,200 -> Response: 233.33  Turnaround 433.33  Wait 233.33
600,200,400 -> Response: 466.67  Turnaround 866.67  Wait 466.67
1200,400,800 -> Response: 933.33  Turnaround 1733.33  Wait 933.33

SJF
300,100,200 -> Response: 133.33  Turnaround 333.33  Wait 133.33
600,200,400 -> Response: 266.67  Turnaround 666.67  Wait 266.67
1200,400,800 -> Response: 533.33  Turnaround 1333.33  Wait 533.33

RR
300,100,200 -> Response: 1.00  Turnaround 466.33  Wait 266.33
600,200,400 -> Response: 1.00  Turnaround 933.00  Wait 533.00
1200,400,800 -> Response: 1.00  Turnaround 1866.33  Wait 1066.33

7. Response times increase as quantum lengths increase since the CPU runs each process for a longer time, reducing how responsive the whole system in average is.

An equation that gives the worst-case response time is:
R ≈ (N - 1) × q