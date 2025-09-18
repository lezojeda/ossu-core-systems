#define _GNU_SOURCE
#include <sched.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include <sys/wait.h>
#include <unistd.h>

#define N 10000

int main() {
  // Pin to CPU 0
  cpu_set_t set;
  CPU_ZERO(&set);
  CPU_SET(0, &set);
  if (sched_setaffinity(0, sizeof(set), &set) == -1) {
    perror("sched_setaffinity");
    exit(1);
  }

  int pipe1[2], pipe2[2];
  pipe(pipe1); // parent -> child
  pipe(pipe2); // child -> parent

  struct timeval prev, after;
  gettimeofday(&prev, NULL);

  int rc = fork();

  if (rc < 0) {
    fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc == 0) {
    // Child process
    char buf;
    for (int i = 0; i < N; i++) {
      // Wait for parent to send
      read(pipe1[0], &buf, 1);
      // Respond to parent
      write(pipe2[1], "x", 1);
    }
    close(pipe1[0]);
    close(pipe1[1]);
    close(pipe2[0]);
    close(pipe2[1]);
    exit(0);
  } else {
    // Parent process
    char buf;
    for (int i = 0; i < N; i++) {
      // Send to child
      write(pipe1[1], "x", 1);
      // Wait for child to respond
      read(pipe2[0], &buf, 1);
    }
    close(pipe1[0]);
    close(pipe1[1]);
    close(pipe2[0]);
    close(pipe2[1]);
    wait(NULL);

    gettimeofday(&after, NULL);

    long seconds = after.tv_sec - prev.tv_sec;
    long useconds = after.tv_usec - prev.tv_usec;
    long total = seconds * 1000000 + useconds;
    double avg = (double)total / (2 * N); // 2 context switches per iteration

    printf("Average context switch cost: %.2f microseconds\n", avg);
  }
  return 0;
}