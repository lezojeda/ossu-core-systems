#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
  if (argc != 2) {
    printf(
        "Usage: %s <argument>, the number of megabytes of memory it will use\n",
        argv[0]);
    return 1;
  }

  int megabytes = atoi(argv[1]);
  // Check if conversion failed (atoi returns 0 on failure)
  if (megabytes <= 0) {
    printf("Invalid number: %s\n", argv[1]);
    return 1;
  }

  // Check reasonable bounds
  if (megabytes > 1000) {
    printf("Too large: %d MB, use 1000 or less\n", megabytes);
    return 1;
  }

  printf("You passed: %s\n megabytes.", argv[1]);

  char *array = malloc(megabytes * 1024 * 1024);
  if (array == NULL) {
    printf("Failed to allocate memory\n");
    return 1;
  }

  // If I allocate X megabytes and store ints in it, how many ints will fit?
  int length = megabytes * 1024 * 1024;

  // "constantly stream through the array, touching each entry"
  while (1) {
    for (int i = 0; i < length; i++) {
		array[i] = i % 256;
    }
  }
}