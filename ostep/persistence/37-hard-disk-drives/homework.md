1. 

| Arguments | Seek Time | Rotation Time | Transfer Time | Total Time | Notes |
|-----------|-----------|---------------|---------------|------------|-------|
| `-a 0` | 0.0 | 165.0 | 30.0 |195 | |
| `-a 6` | 0.0 |345.0 |30.0 |375 | |
| `-a 30` |80.0|265.0|30.0 |375 | |
| `-a 7,30,8` | 160.0|545.0 |90.0 |795 | |
| `-a 10,11,12,13` |40.0 |425.0 |120.0 | 585| |
| `-a 10,18` |40.0 |275.0 |60.0 |375 | Cross-track access |

2. The requests that don't require seek take the same time, `-a 0`, `-a 6`, `a -30`. Also the last two since the seek time isn't a bottleneck in their total time.

In `10,11,12,13` even with a seek of 40 it's not fast enough to complete the seek before 12 and 13 pass under the arm. If we use 0.1 it takes longer since we need an extra rotation until the arm completed the seek.

The request with `7,30,8` is sped up with a seek of 10 since the arm can reach the outer track before 8 rotates away from the arm.

3. All requests take longer.

4. With `-p SSTF` the times are 80.0, 205.0 and 90.0 for seek, rotate and transfer respectively, way lower than with FIFO which makes sense since transfering 30 before 8 is what increases the rotation time so much.

5. It makes no difference since transfering 8 after 7 is the shortest access _and_ the shortest seek time.

6. The seek is not quick enough to transfer 12 and 13 before the arm is positioned in their track so an entire rotation is wasted until those sectors are below the arm.

With a skew of 2 12 and 13 are positioned in such a way that at the time the seek has finished the arm is already positioned for the transfer.

8. A window of between 10 and 50 is enough to improve performance by several orders of magnitude. But increasing it beyond 50 doesn't improve the performance very much.

No, with -w 1 it doesn't matter, all policies result in the same total time. This makes sense that by only seeing one request at a time there isn't room to prioritize based on shortest access or seek time.

9. `-a 2,4,33,3,1,5,6,7,29,9,10 -G -p SATF`, starve inner track; `-a 25,26,27,28,29,3,4,30,31 -G -p SATF` starve outer track

It solves starvation, for example in the second set of requests 3 got into the same scheduling window than 25, 26 and 27. But performance takes a big hit, it took 1125 time units with BSATF and `-w 4` vs 700 using SATF.

10. 

```
$ ./disk.py -a 9,20 -c            // 435
$ ./disk.py -a 9,20 -c -p SATF    // 465
```

Second one takes longer because it transfers 20 first since it has a shorter access time but then it has to wait an entire rotation to reach 9 resulting in longer time than transfering 9 first.