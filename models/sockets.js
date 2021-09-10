

class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', ( socket ) => {

            // Escuchar evento: mensaje-to-server
            socket.on('move-piece', ( {data} ) => {
                // console.log( data );
                this.io.emit('move-piece', data );
            });

            socket.on('change-turn', ( {player_turn} ) => {
                console.log( 'turno: ' + player_turn );
                this.io.emit('change-turn', player_turn );
            });

            socket.on('update-time', (data)=>{
                console.log(data);
                this.io.emit('update-time', data)
            })

            socket.emit('welcome', 'bienvenido al server')

            console.log('cliente conectado');

            
        });
    }

}


module.exports = Sockets;