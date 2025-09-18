#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
  int x = 100;
  printf("x is initially %d\n", x);

  int rc = fork(); // rc -> return code

  if (rc < 0) {
	// error
    fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc == 0) {
    // child
    printf("x in child is %d before changing it\n", x);
    x = 4;
    printf("x in child is %d\n", x);
  } else {
    // parent
    x = 5;
    printf("x in parent is %d\n", x);
  }
  return 0;
}