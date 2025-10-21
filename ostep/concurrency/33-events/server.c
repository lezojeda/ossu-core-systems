#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>
#include <time.h>

int main() {
  int server_fd = socket(AF_INET, SOCK_STREAM, 0);
  struct sockaddr_in addr = {0};
  addr.sin_family = AF_INET;
  addr.sin_addr.s_addr = INADDR_ANY;
  addr.sin_port = htons(8080);

  bind(server_fd, (struct sockaddr *)&addr, sizeof(addr));
  listen(server_fd, 1);

  while (1) {
    int client_fd = accept(server_fd, NULL, NULL);
    
    // Get current time
    time_t now = time(NULL);
    char *time_str = ctime(&now);
    // Remove newline from ctime output
    time_str[strlen(time_str) - 1] = '\0';
    
    // Create HTTP response with current time
    char response[256];
    snprintf(response, sizeof(response),
             "HTTP/1.1 200 OK\r\n"
             "Content-Type: text/plain\r\n"
             "Content-Length: %zu\r\n"
             "\r\n"
             "%s", strlen(time_str), time_str);
    
    write(client_fd, response, strlen(response));
    close(client_fd);
  }
  close(server_fd);
  return 0;
}