// 1. First, write a simple program called null.c that creates a pointer
// to an integer, sets it to NULL, and then tries to dereference it. Com-
// pile this into an executable called null. What happens when you
// run this program?
#include <unistd.h>

int main() {
	int *x = NULL; // not pointing to any valid memory location, 0 in this case
	int value = *x;
}

// On run it causes a segmentation fault