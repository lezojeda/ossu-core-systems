## 1
Bin:       11011000 11000010 01101011 01000010
XOR: 0b00110011
Addition: 0b01000111
Fletcher: 0b01001001,0b11000100
## 3
When the binary values don't have 1's overlapping, for example:
`./checksum.py -D 1,2,4,8 -c`
```
Add:             15       (0b00001111)
Xor:             15       (0b00001111)
```
Powers of 2:
`./checksum.py -D 2,16,64,128 -c`

```
Add:            210       (0b11010010)
Xor:            210       (0b11010010)
```
For any pair of numbers, their bitwise AND must be 0.
## 4
At least one pair of numbers must have their bitwise AND different from zero

`./checksum.py -D 1,2,4,7 -c` (we only change one value)

```
Add:             14       (0b00001110)
Xor:              0       (0b00000000)
```
## 5
When the sum is the same
## 7
1,2,3,4:
```
Add:              10      (0b00001010)
Xor:              4       (0b00000100)
Fletcher:         10,20   (0b00001010,0b00010100)
```

4,3,2,1
```
Add:              10       (0b00001010)
Xor:              4        (0b00000100)
Fletcher:         10,30    (0b00001010,0b00010100) # different from 1,2,3,4
```
Fletcher's checksum is the only one that differentiates between the two sets of values which is better to minimize the chance of collisions.
## 8
