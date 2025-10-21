1. Only the order of thread execution sometimes change but we're still not allowing deadlocks with `-d` so each thread can complete its work entirely.

2. Not always, sometimes, with numbers > 10000. With lower numbers almost never deadlocks. Something expected since a deadlock is not guaranteed all the time, it depends on the scheduling of the threads and in which part of the code the context switch happens.

3. Besides the trivial values of 0 and 1 no, any value greater than 1 creates concurrency.

4. The code avoids the deadlock by always locking in the same order. So if a thread tries to lock `v_dst` when it has already been locked it'll be blocked and we won't have a scenario with T1->v_dst locked waiting for v_src blocked by T2.

To avoid trying to lock the same address twice.

5. 0.02 seconds, with 1,000,000 it takes 0.17 seconds, with 10,000,000 1.67 seconds.

If we increase the amount of threads while keeping the amount of loops constant the time to complete increases.

6. I expect it to improve significantly since threads don't compete for the same set of vectors waiting for locks to release.

7. No, it's not really needed since only really need to backoff when we can't get the second lock. For example, T1 gets lock A, context switch, T2 gets lock B, tries to get lock A but fail so when control is given to T1 again it continues to get lock B.

Running `./vector-try-wait -t -n 2 -l 100000 -d` takes > 0.5 seconds while the vector global order takes way less with around 0.2 seconds.

The number of retries increases since we have more threads competing for the locks.

8. By using a global lock only one thread is capable of adding vectors at a time, all the rest have to wait.

9. No, it doesn't use locks. It uses the assembly fetch-and-add CPU instruction instead via `asm volatile`.

10. 