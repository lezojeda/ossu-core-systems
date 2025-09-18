#include <stdio.h>
#include <stdlib.h>
#include <sys/wait.h>
#include <unistd.h>
#include <string.h>

int main() {
  int pipefd[2];
  pipe(pipefd);

  int rc = fork();

  if (rc < 0) {
    fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc == 0) {
    const char *msg = "Hello from child 1\n";
    write(pipefd[1], msg, strlen(msg));
    close(pipefd[1]);
    exit(0);
  }

  int rc2 = fork();

  if (rc2 < 0) {
    fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc2 == 0) {
    char buf[100];
    int n = read(pipefd[0], buf, sizeof(buf)-1);
    if (n > 0) {
      buf[n] = '\0';
      printf("Child 2 received: %s", buf);
    }
    close(pipefd[0]);
    exit(0);
  }

  // Parent waits for both children
  close(pipefd[0]);
  close(pipefd[1]);
  wait(NULL);
  wait(NULL);
}