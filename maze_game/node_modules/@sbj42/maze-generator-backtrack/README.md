# maze-generator-backtrack
A recursive-backtracking maze generator algorithm

This is a plugin for the `sbj42/maze-generator` package.

Recursive-backtracking is like a randomized depth-first search of the
grid.  A random passage is dug from a random starting location, making
sure that the passage doesn't intersect itself.  At some point it
becomes impossible for this initial passage to make any more progress.
Then we travel back along the passage until we find a cell where we can
create a branch.  That branch is then extended randomly until it can no
longer proceed.  This process repeats until all cells have been connected
to the maze.

Recursive-backtracking tends to generate long, winding passages,
with few dead-ends.

```
___________________________________________________
| | ___________ _____ | ___________ _ __|__ | _ _ |
| __|________ | | | __| | _______ | | | ____| | |_|
| |__ ___ | __| | | | | |_| ______| | | | __| |__ |
|_____| | | _ | |_____|____ | ___ | | | | ______| |
|____ | __| | | | _______ | | |_____|_| |_____| _ |
| ___ | |___| | | | ___ |___| | ________| ______| |
|__ |_| | _ | |___|__ | _ | __|______ | __| _ __| |
| _ | __| |______ | __| |_|__ _ | _ | |__ |_| | __|
| |_|__ |__ | __| |___|__ _ | |_| | |_____| __|__ |
| | ____| __| _ |______ | |_|_____| _____ | | _ | |
| | |__ _ | __|____ _ |__ | _____ |____ | __| |___|
| |__ | | |____ | __|_| __|____ | | ____| | __|__ |
| __| |_| | __| |____ | |____ | |___|_____|______ |
| | __| __| ____| ____|____ | |______ | _____ __| |
|_______|_______|___________________|_______|_____|
```
