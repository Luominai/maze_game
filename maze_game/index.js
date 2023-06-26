const { Server } = require('socket.io')
const express = require('express')
const http = require('http')
const app = express()
const bodyParser = require('body-parser')
const server = http.createServer(app)
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const io = new Server(server)
const port = 3000
app.use(express.static('public'))
app.set('view engine', 'ejs') //remove if you do not plan to use the ejs view engine
var mazeGen = require('@sbj42/maze-generator')
var games = {}

CHARACTERS = ['1','2','3','4','5','6','7','8','9','0',
              'A','B','C','D','E','F','G','H','I','J',
              'K','L','M','N','O','P','Q','R','S','T',
              'U','V','W','X','Y','Z']

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/create', (req, res) => {
    gamePin = generatePin();
    maze = mazeGen.generate(20, 20, {
        generator: '@sbj42/maze-generator-backtrack'
    });

    mazeData = getMazeData(maze)
    //console.log(mazeData)
    gamePin = generatePin()

    Object.assign(games, {[gamePin] : [mazeData]})

    res.render('host', {'gamePin' : gamePin, 'mazeData' : mazeData})
})

app.post('/join', urlencodedParser, (req, res) => {
    gamePin = req.body.gamePin
    mazeData = games[gamePin]
    mazeData = JSON.stringify(mazeData)
    res.render('game', {'gamePin' : gamePin, 'mazeData' : mazeData})
})

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

io.on('connection', (socket)=> {
    socket.on('checkPin', (gamePin) => {
        socket.emit('checkPin', (gamePin in games))
    })
})

function generatePin(){
    pin = '';
    for(i = 0; i < 6; i++){
        randomNum = Math.floor(Math.random() * CHARACTERS.length)
        pin += CHARACTERS[randomNum];
    }
    return pin;
}

function getMazeData(maze){
    var height = maze.height();
    var width = maze.width();
    data = {};
    //iterate through the maze
    for(var h = 0; h < height; h++) {
        Object.assign(data, {[h] : {}})
        for(var w = 0; w < width; w++) {
            //console.log(h.toString() + "-" + w.toString())
            cell = maze.cell(w, h)

            borders = {
                'north':1, 
                'east':1, 
                'south':1, 
                'west':1,
                'treasure':false
            }

            if (cell.north()) {
                borders['north'] = 0
            }
            if (cell.east()) {
                borders['east'] = 0
            }
            if (cell.south()) {
                borders['south'] = 0
            }
            if (cell.west()) {
                borders['west'] = 0
            }

            // source = {
            //     [h] : {
            //         [w] : borders
            //     }
            // }
            // console.log(source)
            Object.assign(data[h], {[w] : borders})
        }
    }
    randomX = Math.floor(Math.random() * 20)
    randomY = Math.floor(Math.random() * 20)
    borderData = data[randomY][randomX]
    borderData['treasure'] = true
    Object.assign(data[randomY][randomX], borderData)

    reduceWalls(data, .8)

    return data
    //data is structured as follows: (by rows)
    // y-coor : {
    //     x-coor : {'north' : true, 'east' : true, 'south' : false, 'west' : false}
    //     x-coor : {'north' : true, 'east' : true, 'south' : false, 'west' : false}
    // }
}

//a chance to remove all walls in a box
function reduceWalls(mazeData, percent) {
    for(var h=1; h < 19; h++) {
        for(var w=1; w < 19; w++) {
            if(Math.random() > percent) {
                borders = mazeData[h][w]
                borders['north'] = 0
                borders['east'] = 0
                borders['south'] = 0
                borders['west'] = 0

                mazeData[h+1][w]['north'] = 0
                mazeData[h-1][w]['south'] = 0
                mazeData[h][w+1]['west'] = 0
                mazeData[h][w-1]['east'] = 0
            }
        }
    }
}

//runs in http://localhost:3000/
