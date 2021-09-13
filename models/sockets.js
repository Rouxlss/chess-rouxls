
class Sockets {

    constructor( io ) {

        this.io = io;
        this.clientCount = 0;

        this.roomInfo = [
            // {
            //     host_id: socket.id,
            //     host_name: player,
            //     player2_id: socket.io
            //     player2_name: player
            //     room: room
            //     roomid: roomid
            // }
        ];
        
        this.roomCount = this.roomInfo.length;

        this.socketEvents();
    }

    socketEvents() {

        // On connection
        this.io.on('connection', (socket) => {

            socket.on('room', ({room, player, roomid})=> {

                if(this.roomInfo.length == 0) {

                    socket.join(room);
                    this.io.to(room).emit('connectToRoom', {
                        player,
                        msg: player + ' is the host of room. ' + room,
                        room
                    });

                    this.roomInfo.push({
                        room,
                        host_id: socket.id,
                        host_name: player,
                        roomid,
                        player2_id: '',
                        player2_name: ''
                    });

                    this.roomCount = this.roomInfo.length;

                }else {

                    let hostRoom = this.roomInfo.filter(roominfo => roominfo.room == room);


                    if(hostRoom.length == 1 && hostRoom[0].player2_id == '') {
                        
                        this.roomInfo.forEach(room_info => {
                    
                            if(room_info.room == room && room_info.host_id != socket.id) {
                                
                                room_info.player2_id = socket.id;
                                room_info.player2_name = player

                                this.io.emit('match', room_info.room);
                                socket.emit('second-player', {
                                    second_player: true
                                })

                            }

                        });

                    }else if (hostRoom.length == 1 && hostRoom[0].player2_id != '') {

                        socket.emit('full', {
                            msg: 'SALA LLENA',
                            full: true
                        })

                        console.log('SALA LLENA');

                    }else {

                        console.log('NUEVA SALA');

                        socket.join(room);
                        this.io.to(room).emit('connectToRoom', {
                            player,
                            msg: player + ' is the host of room. ' + room,
                            room
                        });
    
    
                        this.roomInfo.push({
                            room,
                            host_id: socket.id,
                            host_name: player,
                            roomid,
                            player2_id: '',
                            player2_name: ''
                        });

                        this.roomCount = this.roomInfo.length;

                    }
                    
                }

                console.log('ROOMS: ');
                console.log(this.roomInfo);
            
            })

        
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

            socket.emit('welcome', {
                roomCount: this.roomCount
            })

            socket.on('disconnecting', () => {

                this.roomInfo.forEach((room_info) => {
                    
                    if(room_info.host_id == socket.id) {
                        
                        console.log('El host abandonó la partida');
                        this.roomInfo = this.roomInfo.filter(room => room.host_id != socket.id)

                    }

                    if(room_info.player2_id == socket.id) {
                        
                        console.log('El jugador 2 abandonó la partida');
                        this.roomInfo = this.roomInfo.filter(room => room.host_id != socket.id)

                    }

                    this.roomCount = this.roomInfo.length;

                });

            });

            console.log('cliente conectado');
            
        });
    }

}


module.exports = Sockets;