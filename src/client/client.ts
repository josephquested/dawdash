// -- SOCKET INTERACTIONS -- //

class Client {
    public socket: SocketIOClient.Socket
    public function : any

    constructor() {
        this.socket = io()

        this.socket.on('connect', function () {
            console.log('connect')
            document.body.innerHTML = ''
        })

        this.socket.on('render', (html: string) => {
            document.body.innerHTML = html
        })

        // this.socket.on('disconnect', function (message: any) {
        //     console.log('disconnect ' + message)
        //     document.body.innerHTML += 'Disconnected from Server : ' + message + '<br/>'
        //     // location.reload();
        // })

        // this.socket.on('message', (message: any) => {
        //     console.log(message)
        //     document.body.innerHTML += message + '<br/>'
        //     this.socket.emit('message', 'Thanks for having me')
        // })

        // this.socket.on('random', function (message: any) {
        //     console.log(message)
        //     document.body.innerHTML += message + '<br/>'
        // })
    }
}

const client = new Client()

// -- PLAYER CONTROLLER -- //

document.onkeydown = processPlayerInput;

function processPlayerInput(e : any) {

    // shooting //
    if (e.keyCode == '38') {
        client.socket.emit('shoot', 0)
    }
    else if (e.keyCode == '39') {
        client.socket.emit('shoot', 1)
    }
    else if (e.keyCode == '40') {
        client.socket.emit('shoot', 2)
    }
    else if (e.keyCode == '37') {
        client.socket.emit('shoot', 3)
    }

    // moving //
    if (e.keyCode === 87) {
        client.socket.emit('move', 0)
    }
    else if (e.keyCode === 68) {
        client.socket.emit('move', 1)
    }
    else if (e.keyCode === 83) {
        client.socket.emit('move', 2)
    }
    else if (e.keyCode === 65) {
        client.socket.emit('move', 3)
    }
}