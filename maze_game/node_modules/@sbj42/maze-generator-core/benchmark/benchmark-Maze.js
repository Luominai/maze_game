var benchmark = require('benchmark');

var dirs = require('../src/directions');
var Maze = require('../src/Maze');

/*eslint no-console: "off"*/
/*global console*/
console.info(new benchmark('Maze#constructor', function() {
    new Maze(1000, 1000);
}).run().toString());

console.info(new benchmark('Maze#setPassage', function() {
    var m = new Maze(100, 100);
    for (var y = 0; y < m.height()-1; y ++) {
        for (var x = 0; x < m.width()-1; x ++) {
            m.setPassage(x, y, dirs.SOUTH, true);
            m.setPassage(x, y, dirs.EAST, true);
        }
    }
}).run().toString());

console.info(new benchmark('Maze#getPassage', function() {
    var m = new Maze(100, 100);
    var c = 0;
    for (var y = 0; y < m.height()-1; y ++) {
        for (var x = 0; x < m.width()-1; x ++) {
            c += m.getPassage(x, y, dirs.SOUTH, true) ? 1 : 0;
            c += m.getPassage(x, y, dirs.EAST, true) ? 1 : 0;
        }
    }
    return c;
}).run().toString());

console.info(new benchmark('Maze#cell', function() {
    var m = new Maze(100, 100);
    var c = 0;
    for (var y = 0; y < m.height()-1; y ++) {
        for (var x = 0; x < m.width()-1; x ++) {
            c += m.cell(x, y).north() ? 1 : 0;
        }
    }
    return c;
}).run().toString());
