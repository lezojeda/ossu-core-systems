#include <stdlib.h>
#include <unistd.h>

int main() {
	int *x = (int *) malloc(sizeof(int));
}

/** Output from running valgrind --leak-check=yes */

/**
==43138== HEAP SUMMARY:
==43138==     in use at exit: 4 bytes in 1 blocks
==43138==   total heap usage: 1 allocs, 0 frees, 4 bytes allocated
==43138== 
==43138== 4 bytes in 1 blocks are definitely lost in loss record 1 of 1
==43138==    at 0x4848899: malloc (in /usr/libexec/valgrind/vgpreload_memcheck-amd64-linux.so)
==43138==    by 0x10915E: main (in /mnt/c/Users/lezoj/Code/ossu-core-systems/ostep/virtualization/14-memory-api/leak)
==43138== 
==43138== LEAK SUMMARY:
==43138==    definitely lost: 4 bytes in 1 blocks
==43138==    indirectly lost: 0 bytes in 0 blocks
==43138==      possibly lost: 0 bytes in 0 blocks
==43138==    still reachable: 0 bytes in 0 blocks
==43138==         suppressed: 0 bytes in 0 blocks
==43138== 
==43138== For lists of detected and suppressed errors, rerun with: -s
==43138== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0 from 0)
 */