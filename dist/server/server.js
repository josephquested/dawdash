"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = __importDefault(require("socket.io"));
const render_1 = __importDefault(require("./render"));
const generateCells_1 = __importDefault(require("./generateCells"));
const getCellFromDir_1 = __importDefault(require("./getCellFromDir"));
const port = process.env.PORT || 3000;
// -- GAME SETUP -- //
let gameData = { rows: 10, cols: 20, tickspeed: 100 };
let cells = (0, generateCells_1.default)(gameData);
let players = {};
let lasers = [];
class App {
    constructor(port) {
        // server setup //        
        this.port = port;
        const app = (0, express_1.default)();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        this.server = new http_1.default.Server(app);
        // socket connection //
        const io = new socket_io_1.default.Server(this.server);
        io.on('connection', function (socket) {
            // spawning in new player  // 
            console.log('player connected: ' + socket.id);
            spawnNewPlayer(socket);
            io.emit('render', (0, render_1.default)(cells, gameData));
            // shooting //
            socket.on('shoot', (dir) => {
                if (players[socket.id] != null) {
                    players[socket.id].dir = dir;
                    attemptShoot(players[socket.id], dir);
                    io.emit('render', (0, render_1.default)(cells, gameData));
                }
            });
            // moving //
            socket.on('move', (dir) => {
                if (players[socket.id] != null) {
                    let player = players[socket.id];
                    attemptMovePlayer(player, dir);
                    io.emit('render', (0, render_1.default)(cells, gameData));
                }
            });
            // disconnecting //
            socket.on('disconnect', () => {
                if (players[socket.id] != null) {
                    console.log('player disconnected: ' + socket.id);
                    players[socket.id].cell.player = null;
                    delete players[socket.id];
                    io.emit('render', (0, render_1.default)(cells, gameData));
                }
            });
        });
        // tick cycle for physics events //
        setInterval(() => {
            processLaserMovement();
            io.emit('render', (0, render_1.default)(cells, gameData));
        }, gameData.tickspeed);
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`listening on port ${this.port}`);
        });
    }
}
new App(port).Start();
// -- PLAYER CONTROL -- //
function spawnNewPlayer(socket) {
    let foundSpawnPos = false;
    let randomIndex;
    while (!foundSpawnPos) {
        randomIndex = getRandomInt(0, cells.length);
        foundSpawnPos = cells[randomIndex].player == null ? true : false;
    }
    let player = {
        id: socket.id,
        img: "player.png",
        dir: 0,
        cell: cells[randomIndex]
    };
    players[player.id] = player;
    player.cell.player = players[player.id];
    return player;
}
function attemptMovePlayer(player, dir) {
    let nextCell = (0, getCellFromDir_1.default)(dir, player.cell, cells, gameData);
    if (nextCell.player == null) {
        player.cell.player = null;
        player.cell = nextCell;
        player.cell.player = player;
    }
}
// -- "Laser Beam" -- //
function attemptShoot(player, dir) {
    let nextCell = (0, getCellFromDir_1.default)(dir, player.cell, cells, gameData);
    if (nextCell != player.cell) {
        let laser = {
            img: "laser.png",
            dir: dir,
            cell: nextCell
        };
        nextCell.laser = laser;
        lasers.push(laser);
    }
}
// -- TICK PHYSICS -- //
function processLaserMovement() {
    lasers.forEach(laser => {
        let nextCell = (0, getCellFromDir_1.default)(laser.dir, laser.cell, cells, gameData);
        if (nextCell != laser.cell) {
            if (nextCell.laser == null) {
                laser.cell.laser = null;
                laser.cell = nextCell;
                nextCell.laser = laser;
                checkForLaserPlayerCollision(laser.cell);
            }
            else {
                destroyLaserInCell(laser, laser.cell);
                destroyLaserInCell(nextCell.laser, nextCell);
            }
        }
        else {
            destroyLaserInCell(laser, laser.cell);
        }
    });
}
function checkForLaserPlayerCollision(cell) {
    if (cell.player != null && cell.laser != null) {
        destroyLaserInCell(cell.laser, cell);
        destroyPlayerInCell(cell.player, cell);
    }
}
function destroyLaserInCell(laser, cell) {
    cell.laser = null;
    let index = lasers.indexOf(laser);
    if (index > -1)
        lasers.splice(index, 1);
}
function destroyPlayerInCell(player, cell) {
    delete players[player.id];
    cell.player = null;
}
// -- UTIL -- //
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
//# sourceMappingURL=server.js.map