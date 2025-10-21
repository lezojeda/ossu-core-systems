#include <assert.h>
#include <pthread.h>
#include <stdlib.h>

typedef struct node {
  int data;
  struct node *next;
} node_t;

typedef struct queue {
  node_t *head;
  node_t *tail;
  pthread_mutex_t head_lock;
  pthread_mutex_t tail_lock;
} queue_t;

void Queue_init(queue_t *q) {
  node_t *tmp = malloc(sizeof(node_t));
  tmp->next = NULL;
  q->head = q->tail = tmp;
  pthread_mutex_init(&q->head_lock, NULL);
  pthread_mutex_init(&q->tail_lock, NULL);
}

void Queue_Enqueue(queue_t *q, int data) {
  node_t *new_node = (node_t *)malloc(sizeof(node_t));
  assert(new_node);
  new_node->data = data;
  new_node->next = NULL;

  pthread_mutex_lock(&q->tail_lock);
  q->tail->next = new_node;
  q->tail = new_node;
  pthread_mutex_unlock(&q->tail_lock);
}

int Queue_Dequeue(queue_t *q, int *data) {
  pthread_mutex_lock(&q->head_lock);
  node_t *tmp = q->head;
  node_t *next_node = tmp->next;
  if (next_node == NULL) {
    pthread_mutex_unlock(&q->head_lock);
    return -1; // queue was empty
  }
  *data = next_node->data;
  q->head = next_node;
  pthread_mutex_unlock(&q->head_lock);
  free(tmp);
  return 0;
}