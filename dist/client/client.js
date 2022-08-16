"use strict";
// -- SOCKET INTERACTIONS -- //
class Client {
    constructor() {
        this.socket = io();
        this.socket.on('connect', function () {
            console.log('connect');
            document.body.innerHTML = '';
        });
        this.socket.on('render', (html) => {
            document.body.innerHTML = html;
        });
    }
}
const client = new Client();
// -- PLAYER CONTROLLER -- //
document.onkeydown = processPlayerInput;
function processPlayerInput(e) {
    // shooting //
    if (e.keyCode == '38') {
        client.socket.emit('shoot', 0);
    }
    else if (e.keyCode == '39') {
        client.socket.emit('shoot', 1);
    }
    else if (e.keyCode == '40') {
        client.socket.emit('shoot', 2);
    }
    else if (e.keyCode == '37') {
        client.socket.emit('shoot', 3);
    }
    // moving //
    if (e.keyCode === 87) {
        client.socket.emit('move', 0);
    }
    else if (e.keyCode === 68) {
        client.socket.emit('move', 1);
    }
    else if (e.keyCode === 83) {
        client.socket.emit('move', 2);
    }
    else if (e.keyCode === 65) {
        client.socket.emit('move', 3);
    }
}
