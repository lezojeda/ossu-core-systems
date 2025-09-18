The Operating Systems: Three Easy Pieces derives its name from the three main parts of it based on virtualization, concurrency and persistency. For each it has a central "crux", these, and its answers, are:
## How to virtualize resources
### The CPU
### The Memory
How can the OS build this abstraction of a private, potentially large
address space for multiple running processes (all sharing memory) on
top of a single, physical memory?
#### Goals
1. One major goal of a virtual memory (VM) system is **transparency**.
The OS should implement virtual memory in a way that is invisible to
the running program.
2. Another goal of VM is **efficiency**. The OS should strive to make the
virtualization as efficient as possible, both in terms of time (i.e., not mak-
ing programs run much more slowly) and space (i.e., not using too much
memory for structures needed to support virtualization).
3. A third VM goal is **protection**. The OS should make sure to
protect processes from one another as well as the OS itself from processes. When one process performs a load, a store, or an instruction fetch, it should not be able to access or affect in any way the memory contents of any other process or the OS itself (that is, anything outside its **address space**) -> isolation among processes
## How to build correct concurrent programs
## How to store data persistently