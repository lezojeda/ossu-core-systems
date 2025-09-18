1. Page-table size grows linearly with address space. When we have a page size of 1K and an address space of 1MB, we expect 1MB / 1KB entries = 1024. If the address space increases to 4MB then we need 4MB/1KB = 4096.

Linear page table size as page size grows will decrease since each entry can accomodate more addresses. 1MB / 1KB, 1MB / 2KB and 1MB / 4KB

Why not use big pages in general? Because it leads to internal fragmentation since applications end up using tiny bits of each and memory quickly fills up with overly-large pages.

2. 4 bits for the VPN, 10 for the offset

`-P 1k -a 16k -p 32k -v -u 0` -> all invalid since we use -u 0

`-P 1k -a 16k -p 32k -v -u 25`:
  VA 0x00003986 (decimal:    14726) --> invalid (VPN 14 is not valid)
  VA 0x00002bc6 (decimal:    11206) --> 0x4FC6 [VPN 10]
  VA 0x00001e37 (decimal:     7735) --> invalid (VPN 7 is not valid)
  VA 0x00000671 (decimal:     1649) --> invalid (VPN 1 is not valid)
  VA 0x00001bc9 (decimal:     7113) --> invalid (VPN 6 is not valid)

`-P 1k -a 16k -p 32k -v -u 50`:
  VA 0x00003385 (decimal:    13189) --> 00003f85 [VPN 12]
  VA 0x0000231d (decimal:     8989) --> invalid (VPN 8 is not valid)
  VA 0x000000e6 (decimal:      230) --> 000060e6 [VPN 0]
  VA 0x00002e0f (decimal:    11791) --> INVALID (VPN 11 is not valid)
  VA 0x00001986 (decimal:     6534) --> 00007586 [VPN 6]

3. 1 and 3 are unrealistic. 1 has pages too small which don't happen in real world scenarios where program need more memory. 3, `-P 1m -a 256m -p 512m -v -s 3`, means trying to use half of the total memory as address space leaving no room for OS, other processes or tables themselves.

4. 