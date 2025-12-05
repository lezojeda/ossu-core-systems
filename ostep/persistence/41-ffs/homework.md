## 1
The allocation will divide the large file data blocks across the 10 groups since it requires 40 data blocks and we have 10 groups by default.
```
group inodes    data
    0 /a-------- /aaaa----- ---------- ----------
    1 ---------- aaaa------ ---------- ----------
    2 ---------- aaaa------ ---------- ----------
    3 ---------- aaaa------ ---------- ----------
    4 ---------- aaaa------ ---------- ----------
    5 ---------- aaaa------ ---------- ----------
    6 ---------- aaaa------ ---------- ----------
    7 ---------- aaaa------ ---------- ----------
    8 ---------- aaaa------ ---------- ----------
    9 ---------- aaaa------ ---------- ----------
```
## 2
Spread across two groups
```
group inodes    data
    0 /a-------- /aaaaaaaaa aaaaaaaaaa aaaaaaaaaa
    1 ---------- aaaaaaaaaa a--------- ----------
    2 ---------- ---------- ---------- ----------
    3 ---------- ---------- ---------- ----------
    4 ---------- ---------- ---------- ----------
    5 ---------- ---------- ---------- ----------
    6 ---------- ---------- ---------- ----------
    7 ---------- ---------- ---------- ----------
    8 ---------- ---------- ---------- ----------
    9 ---------- ---------- ---------- ----------
```
## 3
As the large-file exception parameter changes from low values to high values we expect the filespan to decrease because the file will be less spread out across distant data blocks. These are the results of increasing the large-file exception:

| large-file exception | avg filespan |
|---|---|
| 4 | 372 |
| 8 | 181 |
| 16 | 101 |
| 30 | 72 |
## 4
We have three main file-holding directories, /, /j and /t, each with several small files. Files will be laid across three different groups, to ensure locality and reduce seek time.
```
group inodes    data
    0 /abcdefghi /aabbccdde effgghhii- ----------
    1 jlmnopqrC- jlmnopqrCC C--------- ----------
    2 tuvwxyzAB- tuuuvvvwww xxxyyyzzzA AABBB-----
    3 ---------- ---------- ---------- ----------
    4 ---------- ---------- ---------- ----------
    5 ---------- ---------- ---------- ----------
    6 ---------- ---------- ---------- ----------
    7 ---------- ---------- ---------- ----------
    8 ---------- ---------- ---------- ----------
    9 ---------- ---------- ---------- ----------
```
First group corresponds to the root directory, second one to `j` directory and the third one to `t`.
## 6
Less inodes -> more spread cross group since fewer files can be allocated per group. This will increase dirspan. Avg dirspan with ´-i 5´: 90.50, with ´-i 10´: 52.67
## 7
Using a policy that looks for a pair of groups and chooses the pair with the most free inodes decreases dirspan considerably.

This policy is best for sequential access within a directory since it results in related inodes being closer to each other.
## 8
My prediction before using ´-c´:
```
/-b-d-f--- iiiiiiii-- ---------- ----------
```
But it was wrong, it uses the scattered data blocks by default, doesn't look for a continuous 8 size data block:
```
/ibidifihi iii------- ----------
```
The problem with this resulting layout is that to read the i file the system we'll need to move around spaced data blocks instead of using a contiguous one. This leads to increased seek time, reduced I/O performance and inefficient disk utilization.
## 9
Now it results in a similar layout to my initial prediction
```
/-b-d-f-hi iiiiiii--- ----------
```
dirspan will increase since files are scattered further apart, this is a tradeoff of the contiguous policy. filespan increases too since ´i´'s data blocks are now further from its inode.