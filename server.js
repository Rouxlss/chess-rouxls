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

        // Template engine
        this.app.set('view engine', 'ejs');
        this.app.set('views', __dirname + '/views')

        // this.app.get('/', function (req, res) {
        //     res.render('main', {
        //         imgsrc: 'gok-assets/img/'
        //     })
        // });

        // this.app.get('/medals', function (req, res) {
        //     res.render('medals', {
        //         imgsrc: 'gok-assets/img/'
        //     })
        // });

        // this.app.get('/worlds', function (req, res) {
        //     res.render('worlds', {
        //         imgsrc: 'gok-assets/img/'
        //     })
        // });

        // this.app.get('/lobby', function (req, res) {
        //     res.render('lobby', {
        //         imgsrc: 'gok-assets/img/'
        //     })
        // });

        this.app.get('/game/:id', function (req, res) {
            res.render('game', {
                server: 'https://chess-server-rouxls.herokuapp.com/'
            })
        });

        this.app.get('/room', function (req, res) {
            res.render('room')
        });

        this.app.get('/gameAI', function (req, res) {
            res.render('AI-game')
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