/**
 * @typedef {Object} GridMaskOptions
 * @property {boolean} [interior] The value to intialize interior cells to
 * @property {boolean} [exterior] The value to return for exterior cells
 */

/**
 * A GridMask is a rectangular grid of boolean values.
 *
 * @constructor
 * @param {integer} width
 * @param {integer} height
 * @param {GridMaskOptions} options
 */
function GridMask(width, height, options) {
    if (width < 0 || height < 0)
        throw new Error('invalid size: ' + width + 'x' + height);
    options = options || {};
    var interior = false;
    if (options.interior != null)
        interior = !!options.interior;
    this._width = width;
    this._height = height;
    this._exterior = false;
    if (options.exterior != null)
        this._exterior = !!options.exterior;
    this._blockWidth = (width+31) >> 5;
    if (options._grid) {
        this._grid = options._grid;
        return;
    }
    this._grid = new Array(this._blockWidth * height);
    var initBlock = interior ? ~0 : 0;
    for (var i = 0; i < this._blockWidth * height; i ++) {
        this._grid[i] = initBlock;
    }
}

/**
 * The width of the GridMask
 *
 * @return {integer}
 */
GridMask.prototype.width = function() {
    return this._width;
};

/**
 * The height of the GridMask
 *
 * @return {integer}
 */
GridMask.prototype.height = function() {
    return this._height;
};

/**
 * Returns a copy of the GridMask.
 *
 * @return {GridMask}
 */
GridMask.prototype.clone = function() {
    return new GridMask(this.width(), this.height(), {
        exterior: this._exterior,
        _grid: this._grid.slice()
    });
};

/**
 * Returns the boolean value at the specified cell
 *
 * @param {integer} x
 * @param {integer} y
 */
GridMask.prototype.get = function(x, y) {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        return this._exterior;
    }
    var index = y * this._blockWidth + (x >> 5);
    var mask = 1 << (x & 31);
    return (this._grid[index] & mask) != 0;
};

/**
 * Sets the boolean value at the specified cell.  Throws an
 * error for coordinates that lie outside the grid.
 *
 * @param {integer} x
 * @param {integer} y
 * @param {boolean} [value=true]
 */
GridMask.prototype.set = function(x, y, value) {
    if (value == null)
        value = true;
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        throw new Error('cell out of bounds: ' + x + ',' + y);
    }
    var index = y * this._blockWidth + (x >> 5);
    var mask = 1 << (x & 31);
    if (value)
        this._grid[index] |= mask;
    else
        this._grid[index] &= ~mask;
    return this;
};

/**
 * ...
 *
 * @param {integer} x
 * @param {integer} y
 * @param {boolean} [value=true]
 */
GridMask.prototype.testAndSet = function(x, y, value) {
    if (value == null)
        value = true;
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        if (this._exterior == value)
            return false;
        throw new Error('cell out of bounds: ' + x + ',' + y);
    }
    var index = y * this._blockWidth + (x >> 5);
    var mask = 1 << (x & 31);
    if (((this._grid[index] & mask) != 0) == value)
        return false;
    if (value)
        this._grid[index] |= mask;
    else
        this._grid[index] &= ~mask;
    return true;
};

module.exports = GridMask;
