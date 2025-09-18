1. My prediction before running with `-c`

```
ptr[0] = Alloc(3) returned 1003 (searched 1 elements)
Free List [ Size 1 ]: [ addr:1003 sz:97 ]

Free(ptr[0]) returned 0
Free List [ Size 2 ]: [ addr: 1000 sz:3 ] [ addr: 1003 sz:97 ]

ptr[1] = Alloc(5) returned 1008 (searched 2 elements)
Free List [ Size 2 ]: [ addr: 1000 sz:3 ] [ addr: 1008 sz:92 ]

Free(ptr[1]) returned 0
Free List [ Size 3 ]: [ addr: 1000 sz:3 ] [ addr: 1003 sz:5 ] [ addr: 1008 sz:92 ]

ptr[2] = Alloc(8) returned 1008 (searched 3 elements)
Free List [ Size 3 ]: [ addr: 1000 sz:3 ] [ addr: 1003 sz:5 ] [ addr: 1016 sz:84 ]

Free(ptr[2]) returned 0
Free List [ Size 4 ]: [ addr: 1000 sz:3 ] [ addr: 1003 sz:5 ] [ addr: 1008 sz:8 ] [ addr: 1016 sz:84 ]

ptr[3] = Alloc(8) returned 1008 (searched 4 elements)
Free List [ Size 3 ]: [ addr: 1000 sz:3 ] [ addr: 1003 sz:5 ] [ addr: 1016 sz:84 ]

Free(ptr[3]) returned 0
Free List [ Size 4 ]: [ addr: 1000 sz:3 ] [ addr: 1003 sz:5 ] [ addr: 1008 sz:8 ] [ addr: 1016 sz:84 ]

ptr[4] = Alloc(2) returned 1000 (searched 4 elements)
Free List [ Size 4 ]: [ addr: 1002 sz:1 ] [ addr: 1003 sz:5 ] [ addr: 1008 sz:8 ] [ addr: 1016 sz:84 ]

ptr[5] = Alloc(7) returned 0 (searched 4 elements)
Free List [ Size 4 ]: [ addr: 1002 sz:1 ] [ addr: 1003 sz:5 ] [ addr: 1015 sz:1 ] [ addr: 1016 sz:84 ]
```
What I notice about the free list is that without coalescing it becomes more fragmented as operations go by.

2. Using a worst policy we would get a different result from the second allocation when we have two possible blocks in the memory where to allocate, instead of using the one left available by the previous `Alloc(8)` we would use the largest one starting at 1016:

```
Free(ptr[2]) returned 0
Free List [ Size 4 ]: [ addr: 1000 sz:3 ] [ addr: 1003 sz:5 ] [ addr: 1008 sz:8 ] [ addr: 1016 sz:84 ]

ptr[3] = Alloc(8) returned 1016 (searched 4 elements)
Free List [ Size 4 ]: [ addr: 1000 sz:3 ] [ addr: 1003 sz:5 ] [ addr: 1008 sz:8 ] [ addr: 1024 sz:86 ]
```

We would've searched for 1 more element in this case which makes sense since the worst policy tends to be slower since it has to search the entire free list.

3. Using FIRST we can avoid searching the entire list every time. In this case more specifically when we allocate 8 the second time. The BEST policy has to search through the entire free list to find the best space but the FIRST policy stop searching when it first the first big-enough one. This is what speeds up then, the free list search.

5. Without coalescing larger allocations start to fail over time due to not being able to find an adequate memory block:

For example:

```
ptr[52] = Alloc(5) returned -1 (searched 18 elements)
Free List [ Size 18 ]: [ addr:1000 sz:2 ] [ addr:1002 sz:1 ] [ addr:1006 sz:1 ] [ addr:1007 sz:1 ] [ addr:1013 sz:1 ] [ addr:1014 sz:1 ] [ addr:1015 sz:1 ] [ addr:1021 sz:1 ] [ addr:1022 sz:3 ] [ addr:1031 sz:1 ] [ addr:1032 sz:2 ] [ addr:1034 sz:3 ] [ addr:1041 sz:1 ] [ addr:1042 sz:2 ] [ addr:1048 sz:4 ] [ addr:1052 sz:1 ] [ addr:1069 sz:3 ] [ addr:1096 sz:4 ]
```

With coalescing this doesn't happen, we can allocate 8 bytes with no errors even after many operations and only after searching 4 elements:

```
ptr[50] = Alloc(8) returned 1063 (searched 4 elements)
Free List [ Size 4 ]: [ addr:1004 sz:3 ] [ addr:1019 sz:2 ] [ addr:1041 sz:6 ] [ addr:1071 sz:29 ] 
```

The free list in the first case ends up with size 20 and with size 4 in the second one, considerably smaller.

6. As more percent of ops are allocs more of them return -1 since memory fills up and gets fragmented (many spaces but of small size).

On the contrary if more ops are frees we end up with a very small free list since almost all memory tends to remain free.

7. One way is by using the "Best" policy which ends up with the most fragmented memory and alternating allocation/free operations with the free ops freeing the second-to-last allocated index and the allocation being increasingly larger.

For example

`-H 0 -p BEST -A +1,+2,-0,+3,-1,+4,-2,+5,-3,+6,-4,+7,-5 -c`