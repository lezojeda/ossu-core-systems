1.
`segmentation.py -a 128 -p 512 -b 0 -l 20 -B 512
-L 20 -s 0`:

| VA | Translation | Valid or out |
|----------|----------|-|
| 108 | 492 | Valid |
| 97 | 481 | Out |
| 53 | 53 | Out |
| 33 | 33  | Out |
| 65 | 449  | Out |

`segmentation.py -a 128 -p 512 -b 0 -l 20 -B 512
-L 20 -s 1`:

| VA | Translation | Valid or out |
|----------|----------|-|
| 17 | 17 | Valid |
| 108 | 492 | Valid |
| 97 |  | Out |
| 32 |   | Out |
| 63 |   | Out |

`segmentation.py -a 128 -p 512 -b 0 -l 20 -B 512
-L 20 -s 2`:

| VA | Translation | Valid or out |
|----------|----------|-|
| 122 | 506 | Valid |
| 121 | 505 | Valid |
| 7 | 7 | Valid |
| 10 | 10 | Valid |
| 106 | 490  | Out |

2. The highest legal virtual address is 20 since we have a segment 0 base register of 0 and a segment 0 limit register of 19. For segment 1 is 108, that's why 492 = VA 108 is always valid in the first two seeds.

The lowest illegal VA address is 20 and the highest illegal VA address 107.

To test these we run

- `segmentation.py -a 128 -p 512 -b 0 -l 20 -B 512 -L 20 -s 2 -A 19` and with `-A 20` for the segment 0
- `segmentation.py -a 128 -p 512 -b 0 -l 20 -B 512 -L 20 -s 2 -A 107` and with `-A 108` for the segment 1

`-A 20` and `-A 107` result in segmentation violations; `-A 19` and `-A 108` in valid addresses 

3. `--b0 0 --l0 2 --b1 128 --l1 2`

Physical Memory (128 bytes):
┌─────────────────────────────┐ 0
│     Segment 0               │
│     (base: 0, limit: 2)     │
├─────────────────────────────┤ 2
│                             │
│                             │
│                             │
│     UNALLOCATED             │
│                             │
│                             │
│                             │
├─────────────────────────────┤ 126
│     Segment 1               │ ← Valid addresses: 126-127
│     (base: 126, limit: 2)   │ ← Only 2 addresses total
└─────────────────────────────┘ 128

Virtual Address Space (16 bytes):
┌─────────────────────────────┐ 0
│     Segment 0               │ ← VA 0,1 → valid (PA 0,1)
│     (limit: 2)              │
├─────────────────────────────┤ 2
│                             │ ← VA 2-7 → violation
│     INVALID                 │   (beyond segment 0 limit)
│                             │
├─────────────────────────────┤ 8 (segment boundary)
│                             │ ← VA 8-13 → violation
│     INVALID                 │   (below segment 1 base)
│                             │
├─────────────────────────────┤ 14
│     Segment 1               │ ← VA 14,15 → valid (PA 126,127)
│     (limit: 2)              │
└─────────────────────────────┘ 16

4. To get 90% of the randomly generated VA valid the important parameters are the address space and the registers.

Dividing the address space `a` by 2, we can set b0 = 0, l0 = (`a`/2) * 0.9 and b1 = memorySize, l1 = (`a`/2) * 0.9 to get roughly 90% valid virtual addresses.

For example with a memory of 16K/16384 bytes and an address space of 1024 -> 1024 / 2 = 512 * 0.9 ≈ 460, we use b0 = 0, l0 = 460; b1 = 16384 and l1 = 460
and we will roughly get 90% of valid addresses when we randomly generate them.

5. Setting both limit registers to 0 preventing the generation of any valid address since we have segments with no virtual valid memory addresses.