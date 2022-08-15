import express from 'express'
import http from 'http'
import path from 'path'
import socketIO from 'socket.io'
import render from './render'
import CellData from './celldata'
import GameData from './gamedata'
import generateCells from './generateCells'
import Player from './player'

const port: number = 3000

// -- GAME SETUP -- //

let gameData: GameData = { rows: 10, cols: 20 }
let cellData: CellData[] = generateCells(gameData)
let players = {}

class App {
    private server: http.Server
    private port: number
    
    constructor(port: number) {
        this.port = port
        
        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))
        
        this.server = new http.Server(app)
        const io = new socketIO.Server(this.server)
        
        io.on('connection', function (socket: socketIO.Socket) {
            console.log('a user connected : ' + socket.id)
            
            let randomIndex = getRandomInt(0, cellData.length)

            let player: Player = {
                id: socket.id,
                img: "",
                dir: 0,
                cell: cellData[randomIndex]
            }

            players[player.id] = player
            cellData[randomIndex].player = players[player.id]

            let html = render(cellData, gameData)
            io.emit('render', html)
            
            // socket.emit('message', 'Hello ' + socket.id)

            // socket.broadcast.emit(
            //     'message',
            //     'Everybody, say hello to ' + socket.id
            // )

            // socket.on('disconnect', function () {
            //     console.log('socket disconnected : ' + socket.id)
            // })

            socket.on('move', function (dir: number) {
                players[socket.id].dir = dir
                let html = render(cellData, gameData)
                io.emit('render', html)
            })
        })

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

// util //

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}