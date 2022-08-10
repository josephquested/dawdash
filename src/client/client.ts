class Client {
    private socket: SocketIOClient.Socket
    
    constructor() {
        this.socket = io()
    }
}

const client = new Client()