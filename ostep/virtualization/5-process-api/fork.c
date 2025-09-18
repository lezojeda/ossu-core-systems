#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
  printf("hello world (pid:%d)\n",
         (int)getpid()); // this is the pid of this program itself, p1.c

  int rc = fork(); // duplicates the process, so after calling fork there are
                   // actually 2 instances of p1 running.
  // in the parent process it returns the PID of the child, so > 0
  // in the child process it returns 0

  if (rc < 0) {
    // fork failed
    fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc == 0) {
    // child (new process)
    printf("hello, I am child (pid:%d)\n", (int)getpid());
  } else {
    // parent goes down this path (main)
    printf("hello, I am parent of %d (pid:%d)\n", rc, (int)getpid());
  }
  return 0;
}