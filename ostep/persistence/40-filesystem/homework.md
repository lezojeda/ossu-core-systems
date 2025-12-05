## 1
### seed 17
´´´
Initial state

inode bitmap  10000000
inodes       [d a:0 r:2] [] [] [] [] [] [] [] 
data bitmap   10000000
data         [(.,0) (..,0)] [] [] [] [] [] [] [] 

mkdir("/u");

inode bitmap  11000000
inodes       [d a:0 r:3] [d a:1 r:2] [] [] [] [] [] [] 
data bitmap   11000000
data         [(.,0) (..,0) (u,1)] [(.,1) (..,0)] [] [] [] [] [] [] 

creat("/a");

inode bitmap  11100000
inodes       [d a:0 r:3] [d a:1 r:2] [f a:-1 r:1] [] [] [] [] [] 
data bitmap   11000000
data         [(.,0) (..,0) (u,1) (a,2)] [(.,1) (..,0)] [] [] [] [] [] [] 

unlink("/a");

inode bitmap  11000000
inodes       [d a:0 r:3] [d a:1 r:2] [] [] [] [] [] [] 
data bitmap   11000000
data         [(.,0) (..,0) (u,1)] [(.,1) (..,0)] [] [] [] [] [] [] 

mkdir("/z");

inode bitmap  11100000
inodes       [d a:0 r:4] [d a:1 r:2] [d a:2 r:2] [] [] [] [] [] 
data bitmap   11100000
data         [(.,0) (..,0) (u,1) (z,2)] [(.,1) (..,0)] [(.,2) (..,0)] [] [] [] [] [] 

mkdir("/s");

inode bitmap  11110000
inodes       [d a:0 r:5] [d a:1 r:2] [d a:2 r:2] [d a:3 r:2] [] [] [] [] 
data bitmap   11110000
data         [(.,0) (..,0) (u,1) (z,2) (s,3)] [(.,1) (..,0)] [(.,2) (..,0)] [(.,3) (..,0)] [] [] [] [] 

creat("/z/x");

inode bitmap  11111000
inodes       [d a:0 r:5] [d a:1 r:2] [d a:2 r:2] [d a:3 r:2] [f a:-1 r:1] [] [] [] 
data bitmap   11110000
data         [(.,0) (..,0) (u,1) (z,2) (s,3)] [(.,1) (..,0)] [(.,2) (..,0) (x,4)] [(.,3) (..,0)] [] [] [] []
´´´
### seed 18
´´´
Initial state

inode bitmap  10000000
inodes       [d a:0 r:2] [] [] [] [] [] [] [] 
data bitmap   10000000
data         [(.,0) (..,0)] [] [] [] [] [] [] [] 

mkdir("/f");

inode bitmap  11000000
inodes       [d a:0 r:3] [d a:1 r:2] [] [] [] [] [] [] 
data bitmap   11000000
data         [(.,0) (..,0) (f,1)] [(.,1) (..,0)] [] [] [] [] [] [] 

creat("/s");

inode bitmap  11100000
inodes       [d a:0 r:3] [d a:1 r:2] [f a:-1 r:1] [] [] [] [] [] 
data bitmap   11000000
data         [(.,0) (..,0) (f,1) (s,2)] [(.,1) (..,0)] [] [] [] [] [] [] 

mkdir("/h");

inode bitmap  11110000
inodes       [d a:0 r:4] [d a:1 r:2] [f a:-1 r:1] [d a:2 r:2] [] [] [] [] 
data bitmap   11100000
data         [(.,0) (..,0) (f,1) (s,2) (h,3)] [(.,1) (..,0)] [(.,3) (..,0)] [] [] [] [] [] 

fd=open("/s", O_WRONLY|O_APPEND); write(fd, buf, BLOCKSIZE); close(fd);

inode bitmap  11110000
inodes       [d a:0 r:4] [d a:1 r:2] [f a:3 r:1] [d a:2 r:2] [] [] [] [] 
data bitmap   11110000
data         [(.,0) (..,0) (f,1) (s,2) (h,3)] [(.,1) (..,0)] [(.,3) (..,0)] [f] [] [] [] [] 

creat("/f/o");

inode bitmap  11111000
inodes       [d a:0 r:4] [d a:1 r:2] [f a:3 r:1] [d a:2 r:2] [f a:-1 r:1] [] [] [] 
data bitmap   11110000
data         [(.,0) (..,0) (f,1) (s,2) (h,3)] [(.,1) (..,0) (o,4)] [(.,3) (..,0)] [f] [] [] [] [] 

creat("/c");

inode bitmap  11111100
inodes       [d a:0 r:4] [d a:1 r:2] [f a:3 r:1] [d a:2 r:2] [f a:-1 r:1] [f a:-1 r:1] [] [] 
data bitmap   11110000
data         [(.,0) (..,0) (f,1) (s,2) (h,3) (c,5)] [(.,1) (..,0) (o,4)] [(.,3) (..,0)] [f] [] [] [] []
´´´
## 2.
´´´
Initial state

inode bitmap  10000000
inodes       [d a:0 r:2] [] [] [] [] [] [] [] 
data bitmap   10000000
data         [(.,0) (..,0)] [] [] [] [] [] [] [] 

mkdir("/o");

inode bitmap  11000000
inodes       [d a:0 r:2] [d a:1 r:2] [] [] [] [] [] [] 
data bitmap   11000000
data         [(.,0) (..,0) (o,1)] [(.,1) (..,0)] [] [] [] [] [] [] 

creat("/b");

inode bitmap  11100000
inodes       [d a:0 r:2] [d a:1 r:2] [f a:-1 r:1] [] [] [] [] [] 
data bitmap   11000000
data         [(.,0) (..,0) (o,1) (b,2)] [(.,1) (..,0)] [] [] [] [] [] [] 

creat("/o/q");

inode bitmap  11110000
inodes       [d a:0 r:2] [d a:1 r:2] [f a:-1 r:1] [f a:-1 r:1] [] [] [] [] 
data bitmap   11000000
data         [(.,0) (..,0) (o,1) (b,2)] [(.,1) (..,0) (q,3)] [] [] [] [] [] [] 

fd=open("/b", O_WRONLY|O_APPEND); write(fd, buf, BLOCKSIZE); close(fd);

inode bitmap  11110000
inodes       [d a:0 r:2] [d a:1 r:2] [f a:2 r:1] [f a:-1 r:1] [] [] [] [] 
data bitmap   11100000
data         [(.,0) (..,0) (o,1) (b,2)] [(.,1) (..,0) (q,3)] [m] [] [] [] [] [] 

fd=open("/o/q", O_WRONLY|O_APPEND); write(fd, buf, BLOCKSIZE); close(fd);

inode bitmap  11110000
inodes       [d a:0 r:2] [d a:1 r:2] [f a:2 r:1] [f a:3 r:1] [] [] [] [] 
data bitmap   1111000
data         [(.,0) (..,0) (o,1) (b,2)] [(.,1) (..,0) (q,3)] [m] [j] [] [] [] [] 

creat("/o/j");

inode bitmap  11111000
inodes       [d a:0 r:2] [d a:1 r:2] [f a:2 r:1] [f a:3 r:1] [f a:-1 r:1] [] [] [] 
data bitmap   11110000
data         [(.,0) (..,0) (o,1) (b,2)] [(.,1) (..,0) (q,3) (j,4)] [u] [u] [] [] [] [] 
´´´
## 3.
The file system quickly runs out of data blocks, only the root directory remains. The ´mkdir´ and ´write´ operations are the ones that fail since they depend on free datablocks. ´creat´ only requires a free inode and ´link´ requires neither.
## 4.
All operations except unlink will fail since we only have one free inode.