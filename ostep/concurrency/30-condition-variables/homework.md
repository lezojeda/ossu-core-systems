1. When I run the program it will start a simulation from the `main` routine from `main-common.c`.

I'll then run a simulation of a certain number of producer and consumer threads that will sleep at certain points based on the flags passed

2. If we don't use the -P or -C flags then the behavior of the code doesn't change since each thread signals and releases the lock after filling or emptying. So no matter the buffer size we'll see an alternating sequence of the two threads consuming and filling.

Larger buffers reduce forced synchronization. With size 1, threads must strictly alternate. With size 3, they could run in bursts (producer fills all 3 slots before consumer runs).

>What would you predict num full to be with different
buffer sizes (e.g., -m 10) and different numbers of produced items
(e.g., -l 100), when you change the consumer sleep string from
default (no sleep) to -C 0,0,0,0,0,0,1?

I'd predict that num_full will increase its value with a maximum of the buffer size since the consumer sleep time lets producers fill the buffer with the produced items.

4. It will take a long time since each consumer is waiting 3 seconds after waking up and before retrieving an item or doing anything useful, it's idle work.

In a Windows machine it took 12.16 seconds and without the -C flag 0.01 seconds.

5. No, changing the buffer size won't make a difference since the problem lies in the idle waiting after waking up. Running it again showed that, with a total time of 11.15 seconds.

6. In this case the consumer thread waiting after unlocking the mutex won't cause the same total delay as it did in the previous scenario since it lets the other threads do their job in the meantime.

The total time was between 2 and 6 seconds, half or less than the time it took when we blocked in c3.

7. The same as before, the bottleneck doesn't lie in the buffer size, it lies in the consumer threads sleeping time.

8. No, with only one producer and one consumer using only one condition variable is fine because we never face the scenario of a wrong thread waking up to a signal like when we use two producers or two consumers.

9. `./main-one-cv-while -l 3 -m 1 -p 1 -c 2 -P 0,0,0,0,0,3,0 -v`

In this example we see the following output:

```
  1 [*  0 ]    c1
  1 [*  0 ] p0
  0 [*--- ]    c4
  0 [*--- ]    c5
  0 [*--- ]    c6
  0 [*--- ]       c1
  0 [*--- ]    c0
  0 [*--- ]       c2
```

Which shows the consumer thread C1 unnecessarily waking up to an empty buffer.

Also `./main-one-cv-while -c 2 -v -P 0,0,0,0,0,0,1` that leads to C0 to wait forever since it wakes up but the producer has already added everything it had to add to the buffer.

10. Again with 1p/1c the scenario works. With two consumes if we run `./main-two-cvs-if -c 2 -p 1 -v -C 0,0,0,2,0,0,0:0,0,0,2,0,0,0` we can produce the scenario of a consumer thread waking up to an empty buffer since its state changed after it woke up and slept for a brief time.

11. If we run `./main-two-cvs-while-extra-unlock -p 1 -c 2 -m 1 -l 100 -C 0,0,0,0,2,0,0:0,0,0,0,0,0,0` with C0 sleeping before the `get` we can reliably cause the problem of one thread consistenly waking up to an empty buffer which in the end causes one consumer thread to do all the gets (99 vs 1) since it wins the lock races.

