#include "../27-threads-api/mythreads.h"
#include <pthread.h>
#include <stdio.h>
#include <sys/time.h>

#define N 100000000
#define THRESHOLD 1024
#define NTHREADS 12

typedef struct __counter_t {
  int global;                     // global count
  pthread_mutex_t glock;          // global lock
  int local[NTHREADS];             // per-CPU count
  pthread_mutex_t llock[NTHREADS]; // ... and locks
  int threshold;                  // update frequency
} counter_t;

// init: record threshold, init locks, init values
// of all local counts and global count
void init(counter_t *c, int threshold) {
  c->threshold = threshold;
  c->global = 0;
  pthread_mutex_init(&c->glock, NULL);
  for (int i = 0; i < NTHREADS; i++) {
    c->local[i] = 0;
    pthread_mutex_init(&c->llock[i], NULL);
  }
}

// update: usually, just grab local lock and update
// local amount; once local count has risen 'threshold',
// grab global lock and transfer local values to it
void update(counter_t *c, int threadID, int amt) {
  int cpu = threadID % NTHREADS;
  pthread_mutex_lock(&c->llock[cpu]);
  c->local[cpu] += amt;
  if (c->local[cpu] >= c->threshold) {
    // transfer to global (assumes amt>0)
    pthread_mutex_lock(&c->glock);
    c->global += c->local[cpu];
    pthread_mutex_unlock(&c->glock);
    c->local[cpu] = 0;
  }
  pthread_mutex_unlock(&c->llock[cpu]);
}

// get: just return global amount (approximate)
int get(counter_t *c) {
  pthread_mutex_lock(&c->glock);
  int val = c->global;
  pthread_mutex_unlock(&c->glock);
  return val; // only approximate!
}

typedef struct {
  counter_t *c;
  int id;
} thread_arg_t;

void *thread_func(void *arg) {
  thread_arg_t *targ = (thread_arg_t *)arg;
  counter_t *c = targ->c;
  int id = targ->id;

  for (int i = 0; i < N / NTHREADS; i++) {
    update(c, id, 1);
  }
  return NULL;
}

int main() {
  counter_t c;
  init(&c, 1024);

  // measure time before
  struct timeval prev, after;
  gettimeofday(&prev, NULL);

  pthread_t threads[NTHREADS];
  thread_arg_t args[NTHREADS];

  for (int i = 0; i < NTHREADS; i++) {
    args[i].c = &c;
    args[i].id = i;
    Pthread_create(&threads[i], NULL, thread_func, &args[i]);
  }

  for (int i = 0; i < NTHREADS; i++) {
    Pthread_join(threads[i], NULL);
  }

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
