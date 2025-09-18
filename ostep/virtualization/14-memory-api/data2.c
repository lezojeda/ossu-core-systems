#include <stdio.h>
#include <stdlib.h>

// Dangling pointer
int main() {
	int *data = (int*)malloc(100 * sizeof(int));
	free(data);
	int val = data[0]; // data is a dangling pointer
	printf("Value in 0 is: %d", val); // unpredictable garbage result
	// Example output: Value in 0 is: -1768323591
}