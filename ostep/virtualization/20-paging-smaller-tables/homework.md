1. Only one register for the top-level page directory base register is needed no matter the levels of the page table. It's enough with the bits of the virtual address to determine which page directory entries to use after that.

2. We need 3 memory references: the page directory access, the page table access and the final data access if it's a valid lookup.

3. The top-level page directory table fits temporal locality because it will be accessed at every cache  miss and the page entry table are suitable for spatial locality.