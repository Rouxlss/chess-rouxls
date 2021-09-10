// Conexión con el socket server
class Socket {

    constructor() {
        this.socket = socket = io("http://localhost:8080");
    }

}

module.exports = Socket;
