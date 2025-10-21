#include <pthread.h>

#include "mythreads.h"

int balance = 0;

void *worker(void *arg) {
 pthread_mutex_t* my_lock = (pthread_mutex_t*) arg;

  Pthread_mutex_lock(my_lock);
  balance++; // unprotected access
  Pthread_mutex_unlock(my_lock);

  return NULL;
}

int main(int argc, char *argv[]) {
  pthread_t p;
  pthread_mutex_t lock;
  pthread_mutex_init(&lock, NULL);

  Pthread_create(&p, NULL, worker, &lock);

  Pthread_mutex_lock(&lock);
  balance++; // unprotected access
  Pthread_mutex_unlock(&lock);

  Pthread_join(p, NULL);

  pthread_mutex_destroy(&lock);
  return 0;
}
