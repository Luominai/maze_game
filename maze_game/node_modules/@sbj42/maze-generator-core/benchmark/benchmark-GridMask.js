var benchmark = require('benchmark');

var GridMask = require('../src/GridMask');

/*eslint no-console: "off"*/
/*global console*/
console.info(new benchmark('GridMask#constructor', function() {
    new GridMask(1000, 1000);
}).run().toString());

console.info(new benchmark('GridMask#set', function() {
    var m = new GridMask(100, 100);
    for (var y = 0; y < m.height(); y ++) {
        for (var x = 0; x < m.width(); x ++) {
            m.set(x, y, true);
        }
    }
}).run().toString());

console.info(new benchmark('GridMask#get', function() {
    var m = new GridMask(100, 100);
    var c = 0;
    for (var y = 0; y < m.height(); y ++) {
        for (var x = 0; x < m.width(); x ++) {
            c += m.get(x, y) ? 1 : 0;
        }
    }
    return c;
}).run().toString());
