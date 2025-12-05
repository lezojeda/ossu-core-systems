## 1
```
Final state of file system:

inode bitmap 1001001111101001
inodes       [d a:0 r:3] [] [] [f a:-1 r:1] [] [] [d a:4 r:3] [f a:14 r:1] [d a:1 r:2] [f a:8 r:1] [d a:7 r:2] [] [f a:-1 r:2] [] [] [d a:12 r:4] 
data bitmap  1100100110001010
data         [(.,0) (..,0) (i,15) (x,12) (s,7)] [(.,8) (..,15)] [] [] [(.,6) (..,15) (t,10)] [] [] [(.,10) (..,6) (r,12)] [a] [] [] [] [(.,15) (..,0) (l,6) (q,8) (j,3) (c,9)] [] [u] [] 
```

Files: ´/s´, ´/x´, ´/i/j´, ´i/l/t/r´, ´/i/c´

Directories: ´/´, ´/i´, ´/i/q/´, ´i/l/t/´
## 2
Inode 3 reference count is 0 when it should be 1 since it's referenced by directory ´i´.

This could be fixed with fsck by scanning al directory entries counting references to each inode. This would detect that inode 3 is allocated but has a reference count of 0. If inode is not referenced by any directory, it would deallocate it and free any associated data blocks. If _it is_ referenced by a directory, like it's happening in the example, the tool would update the ref count to match the actual number of references.
## 3
In seed 3 the inode 11 wasn't properly freed. Its 11th value has a value of 0, there are no data blocks pointing to inode 11 but it's still allocated to ´[f a:-1 r:1]´.

In seed 19 inode 0 is pointing to empty data block 15.
## 4
Inode bitmap value 4 set to 0 while inode 4 is allocated to a directory. Orphan inode. It would be easy to repair by checking that no files nor directories point to it and has no data blocks assigned like in this case.
## 5
-S 6 Orphan inode 14
-S 13 Inode 9 points to dead data block 5