var xcoor = Math.floor(Math.random() * 20)
var ycoor = Math.floor(Math.random() * 20)
var mazeData = document.getElementById('mazeData').innerHTML
mazeData = JSON.parse(mazeData)
mazeData = mazeData['0']

const cardinal = ['north', 'east', 'south', 'west']

var facing = cardinal[Math.floor(Math.random() * 4)]
var front = 1
var right = 1
var back = 1
var left = 1

var box = document.getElementById('box')

function getWalls() {
    return mazeData[ycoor.toString()][xcoor.toString()]
}

function orientWalls() {
    wallData = getWalls()
    if(facing === 'north') {
        front = wallData['north']
        right = wallData['east']
        back = wallData['south']
        left =  wallData['west']
    } 
    else if(facing === 'east') {
        front = wallData['east']
        right = wallData['south']
        back = wallData['west']
        left =  wallData['north']
    } 
    else if(facing === 'south') {
        front = wallData['south']
        right = wallData['west']
        back = wallData['north']
        left =  wallData['east']
    } 
    else if(facing === 'west') {
        front = wallData['west']
        right = wallData['north']
        back = wallData['east']
        left =  wallData['south']
    } 
}

function displayWalls() {
    orientWalls()
    box.style.borderTopWidth = front * 3
    box.style.borderRightWidth = right * 3
    box.style.borderBottomWidth = back * 3
    box.style.borderLeftWidth = left * 3
}

function moveForward() {
    if(getWalls()[facing] === 0) {
        if(facing === 'north') {
            ycoor -= 1
        }
        else if(facing === 'east') {
            xcoor += 1
        }
        else if(facing === 'south') {
            ycoor +=1
        }
        else if(facing === 'west') {
            xcoor -= 1
        }
    }
    displayWalls()
    console.log('moved forward')
    return getCoords()
}

function moveBackward() {
    inverse = {
        'north' : 'south',
        'east' : 'west',
        'south' : 'north',
        'west' : 'east'
    }
    console.log(inverse[facing])

    if(getWalls()[inverse[facing]] === 0) {
        if(inverse[facing] === 'north') {
            ycoor -= 1
        }
        else if(inverse[facing] === 'east') {
            xcoor += 1
        }
        else if(inverse[facing] === 'south') {
            ycoor +=1
        }
        else if(inverse[facing] === 'west') {
            xcoor -= 1
        }
    }
    displayWalls()
    console.log('moved backward')
    return getCoords()
}

function turnRight() {
    if(facing === 'north') {
        facing = 'east'
    }
    else if(facing === 'east') {
        facing = 'south'
    }
    else if(facing === 'south') {
        facing = 'west'
    }
    else if(facing === 'west') {
        facing = 'north'
    }
    displayWalls()
    console.log('turned right')
}

function turnLeft() {
    if(facing === 'north') {
        facing = 'west'
    }
    else if(facing === 'east') {
        facing = 'north'
    }
    else if(facing === 'south') {
        facing = 'east'
    }
    else if(facing === 'west') {
        facing = 'south'
    }
    displayWalls()
    console.log('turned left')
}

function getCoords() {
    return xcoor.toString() + " " + ycoor.toString()
}

function dig() {
    if (mazeData[ycoor][xcoor]['treasure']) {
        alert('you found the treasure')
    } else {
        alert('the treasure is not here')
    }
}

window.addEventListener('keydown', (event) => {
    console.log(event.key)
    if (event.defaultPrevented) {
        return
    }
    if(event.key.toLowerCase() === 'q') {
        turnLeft()
    }
    else if(event.key.toLowerCase() === 'w') {
        moveForward()
    }
    else if (event.key.toLowerCase() === 's') {
        moveBackward()
    }
    else if(event.key.toLowerCase() === 'e') {
        turnRight()
    }
    else if(event.key === ' ') {
        dig()
    }
})

displayWalls()
