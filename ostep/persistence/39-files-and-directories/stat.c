#include <stdint.h>
#include <stdio.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
  if (argc < 2) {
    printf("Usage: %s <filename>\n", argv[0]);
    return 1;
  }

  struct stat sb;
  int rc = stat(argv[1], &sb);

  if (rc == -1) {
    perror("stat");
    return -1;
  }

  // File type
  printf("File type:                ");

  switch (sb.st_mode & S_IFMT) {
  case S_IFBLK:
    printf("block device\n");
    break;
  case S_IFCHR:
    printf("character device\n");
    break;
  case S_IFDIR:
    printf("directory\n");
    break;
  case S_IFIFO:
    printf("FIFO/pipe\n");
    break;
  case S_IFREG:
    printf("regular file\n");
    break;
  case S_IFSOCK:
    printf("socket\n");
    break;
  default:
    printf("unknown?\n");
    break;
  }
  
  // File size
  printf("File size:                %jd bytes\n", (intmax_t)sb.st_size);

  // Blocks allocated
  printf("Blocks allocated:         %jd\n", (intmax_t)sb.st_blocks);

  // Inode number
  printf("Inode number:             %d\n", (int)sb.st_ino);

  // Link count
  printf("Link count:               %d\n", (int)sb.st_nlink);

  return 0;
}