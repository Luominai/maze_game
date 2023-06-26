var dirs = require('./directions');

/**
 * A Cell is a wrapper object that makes it easier to
 * ask for passage information by name.
 *
 * @constructor
 * @private
 * @param {integer} width
 * @param {integer} height
 */
function Cell(north, east, south, west) {
    this._north = north;
    this._east = east;
    this._south = south;
    this._west = west;
}

Cell.prototype.north = function() {
    return this._north;
};

Cell.prototype.west = function() {
    return this._west;
};

Cell.prototype.south = function() {
    return this._south;
};

Cell.prototype.east = function() {
    return this._east;
};

/**
 * A Maze is a rectangular grid of cells, where each cell
 * may have passages in each of the cardinal directions.
 * The maze is initialized with each cell having no passages.
 *
 * @constructor
 * @param {integer} width
 * @param {integer} height
 */
function Maze(width, height) {
    if (width < 0 || height < 0)
        throw new Error('invalid size: ' + width + 'x' + height);
    this._width = width;
    this._height = height;
    this._blockWidth = ((width+1)+15) >> 4;
    this._grid = new Array(this._blockWidth * (height + 1));
    for (var i = 0; i < this._blockWidth * (height + 1); i ++)
        this._grid[i] = 0;
}

/**
 * The width of the Maze
 *
 * @return {integer}
 */
Maze.prototype.width = function() {
    return this._width;
};

/**
 * The height of the Maze
 *
 * @return {integer}
 */
Maze.prototype.height = function() {
    return this._height;
};

// function cellData(grid, blockWidth, x, y) {
//     var index = y * blockWidth + (x >> 3);
//     var shift = ((x & 7) * 4);
//     return (grid[index] >> shift) & 15;
// }
//
// function setCellPassage(grid, blockWidth, x, y, dir, value) {
//     var index = y * blockWidth + (x >> 3);
//     var shift = ((x & 7) * 4);
//     var mask = dirs.bitmask(dir) << shift;
//     if (value)
//         grid[index] |= mask;
//     else
//         grid[index] &= ~mask;
// }

/**
 * Returns the cell at the given position.
 *
 * @param {integer} x
 * @param {integer} y
 * @return {Cell}
 */
Maze.prototype.cell = function(x, y) {
    if (x < 0 || y < 0 || x >= this._width || y >= this._height)
        return new Cell(false, false, false, false);
    var north, east, south, west;
    var index = y * this._blockWidth + (x >> 4);
    var mask = 1 << ((x & 15) * 2);
    north = (this._grid[index] & mask) != 0;
    west = (this._grid[index] & (mask << 1)) != 0;
    south = (this._grid[index + this._blockWidth] & mask) != 0;
    var x2 = x + 1;
    var index2 = y * this._blockWidth + (x2 >> 4);
    var mask2 = 1 << ((x2 & 15) * 2);
    east = (this._grid[index2] & (mask2 << 1)) != 0;
    return new Cell(north, east, south, west);
};

/**
 * Returns whether there is a passage at the given position and
 * direction
 *
 * @param {integer} x
 * @param {integer} y
 * @param {Direction} dir
 */
Maze.prototype.getPassage = function(x, y, dir) {
    if (x < 0 || y < 0 || x >= this._width || y >= this._height)
        return false;
    var index, mask;
    if (dir != dirs.EAST) {
        index = y * this._blockWidth + (x >> 4);
        mask = 1 << ((x & 15) * 2);
        if (dir == dirs.NORTH)
            /* pass through */;
        else if (dir == dirs.WEST)
            mask <<= 1;
        else
            index += this._blockWidth;
    } else {
        index = y * this._blockWidth + ((x + 1) >> 4);
        mask = 1 << (((x + 1) & 15) * 2 + 1);
    }
    return (this._grid[index] & mask) != 0;
};

/**
 * Creates or removes a passage at the given position and
 * direction.  Note that this also creates the corresponding
 * passage in the neighboring cell.
 *
 * @param {integer} x
 * @param {integer} y
 * @param {Direction} dir
 * @param {boolean} value
 */
Maze.prototype.setPassage = function(x, y, dir, value) {
    if (value == null)
        value = true;
    var index, mask;
    if (dir != dirs.EAST) {
        index = y * this._blockWidth + (x >> 4);
        mask = 1 << ((x & 15) * 2);
        if (dir == dirs.NORTH) {
            if (x < 0 || y < 1 || x >= this._width || y >= this._height)
                throw new Error('passage out of bounds: ' + x + ',' + y + ' dir=' + dir);
        } else if (dir == dirs.WEST) {
            if (x < 1 || y < 0 || x >= this._width || y >= this._height)
                throw new Error('passage out of bounds: ' + x + ',' + y + ' dir=' + dir);
            mask <<= 1;
        } else {
            if (x < 0 || y < 0 || x >= this._width || y >= this._height - 1)
                throw new Error('passage out of bounds: ' + x + ',' + y + ' dir=' + dir);
            index += this._blockWidth;
        }
    } else {
        if (x < 0 || y < 0 || x >= this._width - 1 || y >= this._height)
            throw new Error('passage out of bounds: ' + x + ',' + y + ' dir=' + dir);
        index = y * this._blockWidth + ((x + 1) >> 4);
        mask = 1 << (((x + 1) & 15) * 2 + 1);
    }
    if (value)
        this._grid[index] |= mask;
    else
        this._grid[index] &= ~mask;
};

module.exports = Maze;
