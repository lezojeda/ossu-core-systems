1. The idle CPU time decreases and the time spent on user processes (`us` column) increases. Both make sense since we start a process that makes use of the CPU.

If we run more instances, the idle time decreases even more and the user time increases as well proportionally.

2. `swpd` = 0 initially and `free` ≈ 5000

After running the program with 1024 MB the value of `free` decreased by around 1000 but `swpd` stayed in 0. Yes, when the program exited free increased again to around 5000, which makes sense since we ran the program with 1024MB.

3. swap `in` and `out` columns started giving non-zero values running `./mem 5500` which exceeded my free memory of around 5000. It makes total sense since the system starts swapping when the program actually accesses memory that exceeds available RAM and starts moving pages to the disk since it requires extra space.

The first loop takes a while to finish with a considerable lower bandwith than the ones after it since it's when this swapping takes place. In the `vmstat` output one can see how free memory starts decreasing and nearing zero the swapping starts. The subsequent loops are much faster because the system has learned the access pattern and can manage swapping more efficiently, keeping the currently active portion of the array in RAM.

4. The cpu idle time doesn't decrease dramatically. With `./mem 5500` it decreased around 10% which indicates that even though there's a lot going on concerning memory management the CPU can still easily handle other processes. This also makes sense considering the workload is mainly I/O bound.

Block I/O statistics evidenced a peak of activity when the swapping took place and pages were loaded

5. Loop 0 always takes much more than the subsequent from what was explained in previous points. The bandwidth of it decreases as the input increases. But bandwidth of the subsequen ones stays relatively the same.

The performance decreases as swapping increases since we have more disk usage.