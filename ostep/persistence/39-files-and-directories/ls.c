#include <dirent.h>
#include <grp.h>
#include <pwd.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <time.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
  bool long_list = false;
  char *dir = ".";

  if (argc > 1 && strcmp(argv[1], "-l") == 0) {
    long_list = true;
    if (argc > 2) {
      dir = argv[2];
    }
  } else if (argc > 1) {
    dir = argv[1];
  }

  DIR *dirp = opendir(dir);
  if (!dirp) {
    perror("opendir");
    exit(1);
  }

  struct dirent *entry;
  while ((entry = readdir(dirp)) != NULL) {
    if (long_list) {
      // get pathname for stat
      char path[PATH_MAX];
      snprintf(path, sizeof(path), "%s/%s", dir, entry->d_name);

      struct stat sb;
      stat(path, &sb);

      // owner
      struct passwd *pw = getpwuid(sb.st_uid);

      // group
      struct group *gr = getgrgid(sb.st_gid);
      // size

      // modified time
      char time_buf[32];
      strftime(time_buf, sizeof(time_buf), "%b %d %H:%M",
               localtime(&sb.st_ctime));

      printf("%lu %s %s %jd %s %s\n", sb.st_nlink, pw->pw_name, gr->gr_name,
             (intmax_t)sb.st_size, time_buf, entry->d_name);
    } else {
      printf("%s ", entry->d_name);
    }
  }

  closedir(dirp);
  return 0;
}