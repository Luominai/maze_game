var core = require('@sbj42/maze-generator-core');
var GridMask = core.GridMask;
var dirs = core.directions;

/**
 * @typedef {Object} MGOptions
 * @property {Function} random Returns a random float between 0 (inclusive) and 1 (exclusive)
 */

/**
 * Chooses a random integer between 0 (inclusive) and max (exclusive)
 *
 * @param {MGOptions} options
 * @param {integer} max
 */
function randomInt(options, max) {
    return Math.floor(options.random() * max);
}

/**
 * Chooses a random element from an array
 *
 * @param {MGOptions} options
 * @param {Array} array
 */
function randomChoice(options, array) {
    if (array.length == 1)
        return array[0];
    return array[randomInt(options, array.length)];
}

/**
 * Returns an array of directions toward neighboring
 * cells that have not been visited (i.e. cells for
 * which visited.get returns false).
 *
 * @param {MGOptions} options
 * @param {GridMask} visited
 * @param {integer[]} pos
 */
function getUnvisitedDirections(options, visited, pos) {
    var ret = [];
    if (!visited.get(pos[0], pos[1] - 1) && (!options.mask || options.mask.get(pos[0], pos[1] - 1)))
        ret.push(dirs.NORTH);
    if (!visited.get(pos[0] + 1, pos[1]) && (!options.mask || options.mask.get(pos[0] + 1, pos[1])))
        ret.push(dirs.EAST);
    if (!visited.get(pos[0], pos[1] + 1) && (!options.mask || options.mask.get(pos[0], pos[1] + 1)))
        ret.push(dirs.SOUTH);
    if (!visited.get(pos[0] - 1, pos[1]) && (!options.mask || options.mask.get(pos[0] - 1, pos[1])))
        ret.push(dirs.WEST);
    return ret;
}

/**
 * Recursive-backtracking maze generator.
 *
 * @param {Maze} maze
 * @param {MGOptions} options
 */
function backtrack(maze, options) {
    var width = maze.width();
    var height = maze.height();

    // The 'visited' mask marks cells that have been added to the maze
    // We use this to see which neighbors are available for connecting
    // with a passage.  To avoid making a passage to the outside of
    // the grid, we mark the exterior cells as if they were already
    // included.
    var visited = new GridMask(width, height, {exterior: true});

    var cur;
    // Start with a random cell in the grid
    do {
        cur = [randomInt(options, width), randomInt(options, height)];
    } while (options.mask && !options.mask.get(cur[0], cur[1]));
    // Mark the first cell as visited
    visited.set(cur[0], cur[1], true);
    // This array will hold the cells that we've moved through,
    // to which we may return later to create a new branch
    var stack = [];

    // Loop until the maze is complete
    for (;;) {

        // Which directions can we go from this cell,
        // that lead to cells that aren't yet in the maze?
        var neighbors = getUnvisitedDirections(options, visited, cur);

        if (neighbors.length) {
            // If there is at least one such direction, pick
            // one at random
            var dir = randomChoice(options, neighbors);
            // If there were other choices, then push the
            // current cell onto the stack.
            if (neighbors.length > 1)
                stack.push(cur);
            // Dig a passage from the curent cell to the next cell
            maze.setPassage(cur[0], cur[1], dir, true);
            // Move on to the next cell
            cur = dirs.move(cur[0], cur[1], dir);
            // Which is now in the maze
            visited.set(cur[0], cur[1], true);
        } else if (stack.length) {
            // If there are no available directions here, but
            // there are still cells in the stack, then pop
            // the last cell off the stack ("backtracking"),
            // and continue from there ("recusrive")
            cur = stack.pop();
        } else {
            // If there are no available directions and the
            // stack is empty, then the maze is complete
            break;
        }
    }
}

backtrack.id = 'backtrack';
backtrack.name = 'recursive-backtracking';
backtrack.features = {
    mask: true
};

module.exports = backtrack;
