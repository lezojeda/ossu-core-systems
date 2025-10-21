2. Tested with a 6-core/12 logical threads processor. Using only one thread it took around 1600 microseconds to count to 100,000. Using 6 from 3500 to almost 5000 microseconds. Using 12 took around 5000-6000 microseconds, showing a plateau.

This is expected since while the counter is locked only one thread can increment it and the other are busy with other tasks or totally idle.

3. Tests were ran counting up to 100,000,000 and the approximate counter had almost a 2x better performance than the normal counter which matches what we see in the chapter, as well as seeing an impact on the performance as the threshold is smaller.