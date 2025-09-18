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
	close(1);
	printf("Hello from child\n"); // never gets printed
  } else {
	printf("Bye from parent\n");
  }
  return 0;
}