var dirs = {};

/**
 * @typedef {integer} Direction
 */

dirs.NORTH = 0;
dirs.EAST =  1;
dirs.SOUTH = 2;
dirs.WEST =  3;

dirs.ALL = [dirs.NORTH, dirs.EAST, dirs.SOUTH, dirs.WEST];

/**
 * Returns the opposite direction
 *
 * @param {Direction} dir
 * @return {Direction}
 */
dirs.opposite = function(dir) {
    switch (dir) {
        case 0/*dirs.NORTH*/: return 2;
        case 1/*dirs.EAST*/: return 3;
        case 2/*dirs.SOUTH*/: return 0;
        case 3/*dirs.WEST*/: return 1;
        default: throw new Error('bad direction: ' + dir);
    }
};

/**
 * Returns the x component of the direction vector
 *
 * @param {Direction} dir
 * @return {integer}
 */
dirs.dx = function(dir) {
    switch (dir) {
        case 0/*dirs.NORTH*/: return 0;
        case 1/*dirs.EAST*/: return 1;
        case 2/*dirs.SOUTH*/: return 0;
        case 3/*dirs.WEST*/: return -1;
        default: throw new Error('bad direction: ' + dir);
    }
};

/**
 * Returns the y component of the direction vector
 *
 * @param {Direction} dir
 * @return {integer}
 */
dirs.dy = function(dir) {
    switch (dir) {
        case 0/*dirs.NORTH*/: return -1;
        case 1/*dirs.EAST*/: return 0;
        case 2/*dirs.SOUTH*/: return 1;
        case 3/*dirs.WEST*/: return 0;
        default: throw new Error('bad direction: ' + dir);
    }
};

/**
 * Moves the coordinate in the given direction
 *
 * @param {integer} x
 * @param {integer} y
 * @param {Direction} dir
 * @return {integer[]}
 */
dirs.move = function(x, y, dir) {
    switch (dir) {
        case 0/*dirs.NORTH*/: return [x, y-1];
        case 1/*dirs.EAST*/: return [x+1, y];
        case 2/*dirs.SOUTH*/: return [x, y+1];
        case 3/*dirs.WEST*/: return [x-1, y];
        default: throw new Error('bad direction: ' + dir);
    }
};

/**
 * Returns a bitmask for the direction, useful for
 * storing a bunch of direction boolean values in
 * a single integer.
 *
 * @param {Direction} dir
 * @return {integer}
 */
dirs.bitmask = function(dir) {
    return 1 << dir;
};

module.exports = dirs;
