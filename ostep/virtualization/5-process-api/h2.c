#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main() {
  int fd = open("hello-world.txt", O_WRONLY);

  if (fd < 0) {
    perror("open");
    exit(1);
  }

  int rc = fork();

  if (rc < 0) {
    fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc == 0) {
    // child
    const char *msg = "Hello from child process";
    write(fd, msg, strlen(msg));
    printf("file opened in child: wrote to file\n");
  } else {
    // parent
    const char *msg = "Hello from parent process";
    write(fd, msg, strlen(msg));
    printf("file opened in parent: wrote to file\n");
  }
  return 0;
}