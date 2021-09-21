// Servidor de Express
const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');
const path     = require('path');
const cors     = require('cors');

const Sockets  = require('./sockets');

class Server {

    constructor() {

        this.app  = express();
        this.port = process.env.PORT;

        // Http server
        this.server = http.createServer( this.app );
        
        // Configuraciones de sockets
        this.io = socketio( this.server, { /* configuraciones */ } );
    }

    middlewares() {

        // Desplegar el directorio público
        this.app.use( express.static( path.resolve( __dirname, './public' ) ) );

        // view engine
        this.app.set('view engine', 'ejs');
        // this.app.set('views', __dirname + '/public/views');

        this.app.get('/room', function (req, res) {
            res.render('room');
        });

        this.app.get('/AI', function (req, res) {
            res.render('AI-game');
        });

        this.app.get('/game/:id', function (req, res) {
            res.render('game');
        });

        // MAIN PAGES

        this.app.get('/', function (req, res) {
            res.render('main');
            // res.sendFile(path.join(__dirname, './public/index.html'));
        });
        
        // CORS
        this.app.use( cors() );

    }

    // Esta configuración se puede tener aquí o como propieda de clase
    // depende mucho de lo que necesites
    configurarSockets() {
        new Sockets( this.io );
    }

    execute() {

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar sockets
        this.configurarSockets();

        // Inicializar Server
        this.server.listen( this.port, () => {
            console.log('Server corriendo en puerto:', this.port );
        });
    }

}


module.exports = Server;