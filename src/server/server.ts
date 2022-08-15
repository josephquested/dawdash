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

const port: number = 3000

// -- GAME SETUP -- //

let gameData: GameData = { rows: 10, cols: 20 }
let cells: CellData[] = generateCells(gameData)
let players = {}

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
            console.log('a user connected : ' + socket.id)
            spawnNewPlayer(socket)
            io.emit('render', render(cells, gameData))
            
            // shooting //
            socket.on('shoot', function (dir: number) {
                players[socket.id].dir = dir
                io.emit('render', render(cells, gameData))
            })
            
            // moving //
            socket.on('move', function (dir: number) {
                let player : Player = players[socket.id]
                attemptMovePlayer(player, dir)
                io.emit('render', render(cells, gameData))
            })
        })
        
        // socket.emit('message', 'Hello ' + socket.id)

        // socket.broadcast.emit(
        //     'message',
        //     'Everybody, say hello to ' + socket.id
        // )

        // socket.on('disconnect', function () {
        //     console.log('socket disconnected : ' + socket.id)
        // })

        // setInterval(() => {
            //     io.emit('random', Math.floor(Math.random() * 10))
            // }, 1000)
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

// -- UTIL -- //

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}