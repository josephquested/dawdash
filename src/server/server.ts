import express from 'express'
import http from 'http'
import path from 'path'
import socketIO from 'socket.io'
import render from './render'
import CellData from './celldata'
import GameData from './gamedata'
import generateCells from './generateCells'
import getCellFromDir from './getCellFromDir'
import Player from './player'
import Laser from './laser'

const port: number = 3000

// -- GAME SETUP -- //

let gameData: GameData = { rows: 10, cols: 20, tickspeed: 100 }
let cells: CellData[] = generateCells(gameData)
let players = {}
let lasers : Laser[] = []

class App {
    private server: http.Server
    private port: number
    
    constructor(port: number) {

        // server setup //        
        this.port = port
        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))
        this.server = new http.Server(app)

        // socket connection //
        const io = new socketIO.Server(this.server)
        
        io.on('connection', function (socket: socketIO.Socket) {

            // spawning in new player  // 
            console.log('player connected: ' + socket.id)
            spawnNewPlayer(socket)
            io.emit('render', render(cells, gameData))
            
            // shooting //
            socket.on('shoot', (dir: number) => {
                players[socket.id].dir = dir
                attemptShoot(players[socket.id], dir)
                io.emit('render', render(cells, gameData))
            })
            
            // moving //
            socket.on('move', (dir: number) => {
                let player : Player = players[socket.id]
                attemptMovePlayer(player, dir)
                io.emit('render', render(cells, gameData))
            })

            // disconnecting //
            socket.on('disconnect', () => {
                console.log('player disconnected: ' + socket.id)
                players[socket.id].cell.player = null
                players[socket.id] = null
                io.emit('render', render(cells, gameData))
            })
        })
        
        setInterval(() => {
                processLaserMovement()
                io.emit('render', render(cells, gameData))
            }, gameData.tickspeed)
        }
        
    public Start() {
        this.server.listen(this.port, () => {
            console.log(`listening on port ${this.port}`)
        })
    }
}

new App(port).Start()

// -- PLAYER CONTROL -- //

function spawnNewPlayer(socket: socketIO.Socket) {

    let foundSpawnPos : boolean = false
    let randomIndex : number 

    while (!foundSpawnPos){
        randomIndex = getRandomInt(0, cells.length)
        foundSpawnPos = cells[randomIndex].player == null ? true : false 
    }

    let player: Player = {
        id: socket.id,
        img: "player.png",
        dir: 0,
        cell: cells[randomIndex]
    }

    players[player.id] = player
    player.cell.player = players[player.id]

    return player
}

function attemptMovePlayer(player : Player, dir : number) {

    let nextCell : CellData = getCellFromDir(dir, player.cell, cells, gameData)

    if (nextCell.player == null) {
        player.cell.player = null
        player.cell = nextCell
        player.cell.player = player
    }
}

// -- "Laser Beam" -- //

function attemptShoot(player : Player, dir : number) {

    let nextCell : CellData = getCellFromDir(dir, player.cell, cells, gameData)

    if (nextCell != player.cell) {

        let laser: Laser = {
            img: "laser.png",
            dir: dir,
            cell: nextCell
        }

        nextCell.laser = laser
        lasers.push(laser)
    }
}

// -- TICK PHYSICS -- //

function processLaserMovement() {

    lasers.forEach(laser => {

        let nextCell : CellData = getCellFromDir(laser.dir, laser.cell, cells, gameData)

        if (nextCell != laser.cell) {

            if (nextCell.laser == null) {
                laser.cell.laser = null
                laser.cell = nextCell
                nextCell.laser = laser

            } else {
                destroyLaserInCell(laser, laser.cell)
                destroyLaserInCell(nextCell.laser, nextCell)
            }

        } else {
            destroyLaserInCell(laser, laser.cell)
        }
    })
}

function destroyLaserInCell(laser : Laser, cell : CellData) {
    cell.laser = null
    let index : number = lasers.indexOf(laser);
    if (index > -1)
        lasers.splice(index, 1)
}

// -- UTIL -- //

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}