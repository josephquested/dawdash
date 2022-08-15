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

let gameData: GameData = { rows: 10, cols: 20 }
let cellData: CellData[] = generateCells(gameData)

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
            
            let player: Player = {
                id: socket.id,
                img: "",
                dir: 3,
                cell: cellData[6]
            }

            cellData[6].player = player

            let html = render(cellData, gameData)
            socket.emit('render', html)
            
            // socket.emit('message', 'Hello ' + socket.id)

            // socket.broadcast.emit(
            //     'message',
            //     'Everybody, say hello to ' + socket.id
            // )

            // socket.on('disconnect', function () {
            //     console.log('socket disconnected : ' + socket.id)
            // })

            // socket.on('message', function (message: any) {
            //     console.log(message)
            // })
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