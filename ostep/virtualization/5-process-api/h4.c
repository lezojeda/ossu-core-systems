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
	execl("/bin/ls", "ls", NULL); // does not use the PATH variable, we need /bin/
  } else {
	wait(NULL);
	execlp("ls", ".", NULL); // uses the PATH variable
  }
  return 0;
}