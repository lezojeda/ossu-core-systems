#include "../27-threads-api/mythreads.h"
#include <pthread.h>
#include <stdio.h>

typedef struct __counter_t {
  int value;
  pthread_mutex_t lock;
} counter_t;

void init(counter_t *c) {
  c->value = 0;
  Pthread_mutex_init(&c->lock, NULL);
}

void increment(counter_t *c) {
  Pthread_mutex_lock(&c->lock);
  c->value++;
  Pthread_mutex_unlock(&c->lock);
}

void decrement(counter_t *c) {
  Pthread_mutex_lock(&c->lock);
  c->value--;
  Pthread_mutex_unlock(&c->lock);
}

int get(counter_t *c) {
  Pthread_mutex_lock(&c->lock);
  int rc = c->value;
  Pthread_mutex_unlock(&c->lock);
  return rc;
}

#define N 100000000

void *thread_func(void *arg) {
  counter_t *c = (counter_t *)arg;
  for (int i = 0; i < N / 12; i++) {
    increment(c);
  }
  return NULL;
}

int main() {
  counter_t c;
  init(&c);

  // measure time before
  struct timeval prev, after;
  gettimeofday(&prev, NULL);

  pthread_t t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12;
  Pthread_create(&t1, NULL, thread_func, &c);
  Pthread_create(&t2, NULL, thread_func, &c);
  Pthread_create(&t3, NULL, thread_func, &c);
  Pthread_create(&t4, NULL, thread_func, &c);
  Pthread_create(&t5, NULL, thread_func, &c);
  Pthread_create(&t6, NULL, thread_func, &c);
  Pthread_create(&t7, NULL, thread_func, &c);
  Pthread_create(&t8, NULL, thread_func, &c);
  Pthread_create(&t9, NULL, thread_func, &c);
  Pthread_create(&t10, NULL, thread_func, &c);
  Pthread_create(&t11, NULL, thread_func, &c);
  Pthread_create(&t12, NULL, thread_func, &c);

  Pthread_join(t1, NULL);
  Pthread_join(t2, NULL);
  Pthread_join(t3, NULL);
  Pthread_join(t4, NULL);
  Pthread_join(t5, NULL);
  Pthread_join(t6, NULL);
  Pthread_join(t7, NULL);
  Pthread_join(t8, NULL);
  Pthread_join(t9, NULL);
  Pthread_join(t10, NULL);
  Pthread_join(t11, NULL);
  Pthread_join(t12, NULL);

  // measure time after
  gettimeofday(&after, NULL);

  long seconds = after.tv_sec - prev.tv_sec;
  long useconds = after.tv_usec - prev.tv_usec;

  // handle negative microseconds
  if (useconds < 0) {
    seconds -= 1;
    useconds += 1000000;
  }

  double elapsed = seconds + useconds / 1e6;

  printf("Counting took: %.6f seconds\n", elapsed);
}
