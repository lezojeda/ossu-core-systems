#include <fcntl.h>
#include <stdio.h>
#include <sys/time.h>
#include <unistd.h>

int main() {
  // Empty read
  int fd = open("/dev/null", O_RDONLY);
  char buffer[1];
  
  // Measure time before
  struct timeval prev, after;
  gettimeofday(&prev, NULL);

  for (int i = 0; i < 10000; i++) {
    read(fd, buffer, 0);
  }

  // Measure time after the loop
  gettimeofday(&after, NULL);

  // Get total time adding seconds to microseconds
  long total_usec =
      (after.tv_sec - prev.tv_sec) * 1000000 + (after.tv_usec - prev.tv_usec);
  double microseconds = (double)total_usec / 10000;
  double nanoseconds = microseconds * 1000;

  printf("read takes on average: %g microseconds and %g nanoseconds\n",
         microseconds, nanoseconds);

  close(fd);
  return 0;
}