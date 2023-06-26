# maze-generator-support
Support library for maze generator algorithms

This library supplies support classes for the
[@sbj42/maze-generator](https://www.npmjs.com/package/@sbj42/maze-generator)
library, and the various maze algorithm plugins designed to work with it.

## directions

A collection of cardinal direction utilities.

```
var dirs = require('@sbj42/maze-generator-support').directions;
```

`dirs.NORTH` / `dirs.EAST` / `dirs.SOUTH` / `dirs.WEST`

Constants representing the cardinal directions.

`dirs.ALL`

An array containing all the cardinal direction constants.

`dirs.opposite(dir)`

Returns the opposite of the direction given.

## GridMask

A rectangular grid of boolean values, useful for marking visited cells in a maze.

```
var GridMask = require('@sbj42/maze-generator-support').GridMask;
```

`new GridMask(width, height, options)`

Creates a new GridMask.  By default the interior cells are initialized to `false`, and
exterior cells will return `false`.  The (optional) `options` argument can be
used to change that behavior:
* `options.interior`: (optional) The boolean value to which interior cells are initialized.
* `options.exterior`: (optional) The boolean value which will be returned for exterior cells.

`GridMask.width()` / `GridMask.height()`

Returns the width or height of the GridMask.

`GridMask.get(x, y)`

Returns the boolean value for the given cell.  For cells outside the rectangular bounds,
this returns `false`, or the value of `options.exterior` if given in the construtor.

`GridMask.set(x, y, value)`

Sets the boolean value for the given cell.  Throws an error for cells outside the rectangular
bounds.

## Maze

A rectangular grid of cells, each of which may have passages in one or more of the four
cardinal directions.

```
var Maze = require('@sbj42/maze-generator-support').Maze;
```

`new Maze(width, height)`

Creates a new Maze.  The cells are all initialized to have no passages in any direction
(or put another way, they have walls in all four directions).

`maze.width()` / `maze.height()`

Return the width and height of the maze.

`maze.cell(x, y)`

Returns a `Cell` object for the cell at the given position.  For coordinates outside the
rectangular bounds, this returns a `Cell` object with no passages.

`maze.getPassage(x, y, dir)`

Returns whether there is a passage at the given cell in the given direction.  Returns
`false` for coordinates outside the rectangular bounds, or for directions that would lead
to a cell outside the bounds.

`maze.setPassage(x, y, dir, value)`

Sets whether there is a passage at the given cell in the given direction.  Throws an error
for coordinates outside the rectangular bounds, or for directions that would lead
to a cell outside the bounds.  This always adds the corresponding passage in the
neighboring cell, so that the two cells have passages leading to each other.

## Cell

An object representing a cell in a maze.  There is no exported constructor, you have to
get cell objects by calling `maze.cell(x, y)`.

`cell.north()` / `cell.east()` / `cell.south()` / `cell.west()`

These boolean properties indicate whether the cell has a passage in each of the cardinal
directions.  If the property is `true`, then there is a passage in that direction.
`false` indicates a wall.
