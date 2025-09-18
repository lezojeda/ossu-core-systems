2. The resulting final process trees will have little ramifications with lower percentages and more as the amount of next actions are forks.

4. Orphaned processes become children of the root process. This represents the default UNIX behavior. With the flag `-R` these are reparented by the closest parent which is `b`.

6. If the amount of actions is equal to the final running processes one can tell exactly the actions that took place. But if the amount of actions is higher than the final running processes we can't tell because we lack the information of what happened with processes that forked and exited.
## Homework (code)
1. Before changing its value x has the same one both in the child and parent process, but after changing it in both of the process x has a different value in the child and the parent.
2. Yes, both process can access the file descriptor. And both write to it. The order in which they write to the file will depend on how the OS schedules the processes so we have no guarantee in the final order of writes.
3. No, without `wait` it's not possible since it's up to the CPU **scheduler** to determine which process runs first and it's not under our control (5.1 "The fork() System Call" in the book).
5. `wait` returns the process id of the child process created from the fork. If we use it inside a child process which has no children processes itself, it returns immediately with a value of -1.
6. When we have multiple children and we want to wait for a specific one of those to finish from the parent.
7. Nothing gets printed to standard output since it's closed
