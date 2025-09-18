#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
  int rc = fork();

  if (rc < 0) {
    fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc == 0) {
	int pid = wait(NULL);
	printf("Hello from child\n");
	printf("Using wait in a child process immediately returns with a value of %d since  it has no child processes.\n", (int)pid);
  } else {
	waitpid(rc, NULL, 0);
	printf("Child process with PID: %d finished.\n", rc);
	printf("Bye from parent\n");
  }
  return 0;
}