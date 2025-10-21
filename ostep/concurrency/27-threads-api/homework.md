1. It points to lines 14 and 15. The first one that creates the second thread (first one being main) and line 15 the unprotected `balance` access that results in a race condition.

It also reports whenever a new thread is created (`Thread #{n} was created [...]`), the size of the read during the data race which is size 4 since we're using `int` (4 bytes, 32 bits) and also that neither thread is holding any lock.

2. If we remove the unprotected access in line 15 valgrind with helgrind reports 0 errors.

If only one lock is applied, for example in the main thread, valgrind still reports errors since the second thread still acceses `balance` without synchronization so the race condition persists.

If we use a lock in both the shared variable is properly protected and valgrind doesn't report errors since when any thread tries to access it, it'll wait the mutex is available.

3. Each thread tries to lock an already possibly locked mutex. Thread 1 (`arg = 0`) tries to lock m2 but it may fail if it's already locked by thread 2.

4. Helgrind reports a lock order violation. It detects that threads are trying to grab the same two locks in different orders which can lead to a deadlock depending on how the lock acquisitions happen.

5. No, since the access to the problematic lock acquisition is in itself protected by a global lock (`&g`). That it's not a perfect tool, it may have false positives due to a conservative approach, it doesn't understand that `g` acts as a "meta-lock"

6. It's inefficient because the main thread ends up just spinning and wasting CPU cycles waiting for the other thread to finish.

7. Helgrind reports a possible data race when accessing `done`. The code is incorrect since it should use condition variables to synchronize the threads instead of a boolean global flag.

8. This code is preferred because it doesn't waste CPU cycles, it's both, correctness and performance.

9. Helgrind correctly reports no errors in this case.