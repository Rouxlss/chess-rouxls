
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
            //     time:time
            //     fen:fen
            // }
        ];

        this.clock_interval = [];
        
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
                        player2_name: '',
                        white_time: [],
                        black_time: [],
                        fen: 'start'
                    });

                    this.clock_interval.push(['', '', room]);

                    socket.emit('first-player', {
                        first_player: true,
                        fen: 'start'
                    })

                    this.roomCount = this.roomInfo.length;

                }else {

                    let hostRoom = this.roomInfo.filter(roominfo => roominfo.room == room);

                    if(hostRoom.length == 1 && hostRoom[0].player2_id == '') {
                        
                        this.roomInfo.forEach(room_info => {
                    
                            if(room_info.room == room && room_info.host_id != socket.id) {

                                socket.join(room);
                                
                                room_info.player2_id = socket.id;
                                room_info.player2_name = player
                                room_info.white_time =  [5,0]
                                room_info.black_time =  [5,0]

                                this.io.emit('match', room_info);

                                socket.emit('second-player', {
                                    second_player: true,
                                    fen: 'start'
                                })

                            }

                        });

                    }else if (hostRoom.length == 1 && hostRoom[0].player2_id != '') {

                        socket.emit('full', {
                            msg: 'SALA LLENA',
                            full: true
                        })

                        // console.log('SALA LLENA');

                    }else {

                        // console.log('NUEVA SALA');

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

                        this.clock_interval.push(['', '', room]);

                        socket.emit('first-player', {
                            first_player: true
                        })

                        this.roomCount = this.roomInfo.length;

                    }
                    
                }

                // console.log('ROOMS: ');
                // console.log(this.roomInfo);
            
            })

            socket.on('move', (msg) => {
                // console.log(move, board, room);
                socket.broadcast.emit('move', msg);
            })

            socket.emit('welcome', {
                roomCount: this.roomCount
            })

            socket.on('time-discount', ({player, actual_room_id, room}) => {

                // console.log(actual_room_id);
                
                if(player==0){

                    clearInterval(this.clock_interval[actual_room_id][0]);

                    let time = this.roomInfo[actual_room_id].white_time;


                        this.clock_interval[actual_room_id][0] = setInterval(() => {


                            if(time[0]<=0 && time[1]<=0){

                                clearInterval(this.clock_interval[actual_room_id][0]);
                                
                                this.io.emit('win', {
                                    win: 'BLACK WINS',
                                    room: this.roomInfo[actual_room_id].room
                                })
        
                            }else {

                                --time[1];
                                if(time[1]<0){
                                    time[1]=59;
                                    --time[0]
                                }
                            
                            }
                            
                      
                            let clock = `${time[0]}:${('00' + time[1]).slice(-2)}`
                      
                            this.io.emit('update-white-time', {
                                  white: clock,
                                  room
                              })
    
                              this.roomInfo[actual_room_id].white_time=time;
                      
                        }, 1000);

                    

                }else if( player == 1) {

                    clearInterval(this.clock_interval[actual_room_id][1]);

                    let time = this.roomInfo[actual_room_id].black_time;

                    this.clock_interval[actual_room_id][1] = setInterval(() => {

                        if(time[0]<=0 && time[1]<=0){

                            clearInterval(this.clock_interval[actual_room_id][1]);
                            
                            this.io.emit('win', {
                                win: 'WHITE WINS',
                                room: this.roomInfo[actual_room_id].room
                            })
    
                        }else {
                            
                            time[1]--;
                            if(time[1]<0){
                                time[1]=59;
                                time[0]--
                            }
                        
                        }
                    
                        let clock = `${time[0]}:${('00' + time[1]).slice(-2)}`
                    
                        this.io.emit('update-black-time', {
                                black: clock,
                                room
                            })

                        this.roomInfo[actual_room_id].black_time=time;
                      
                    }, 1000);
 

                }

                // console.log(this.clock_interval);

            })

            socket.on('time-stop', ({player, actual_room_id, room}) => {

                if(player==0){

                    clearInterval(this.clock_interval[actual_room_id][0]);
                    let time = this.roomInfo[actual_room_id].white_time;
                    let clock = `${time[0]}:${('00' + time[1]).slice(-2)}`
                    this.io.emit('update-white-time', {
                        white: clock,
                        room
                    })
                    this.roomInfo[actual_room_id].white_time=time;
                }
                else if(player==1){

                    clearInterval(this.clock_interval[actual_room_id][1]);
                    let time = this.roomInfo[actual_room_id].black_time;
                    let clock = `${time[0]}:${('00' + time[1]).slice(-2)}`
                    this.io.emit('update-black-time', {
                        black: clock,
                        room
                    })
                    this.roomInfo[actual_room_id].black_time=time;
                }

            })

            socket.on('checkmate', ({status, actual_room_id})=>{
                this.io.emit('win', {
                    status,
                    room: this.roomInfo[actual_room_id].room
                })
            })

            socket.on('drawn', ({status, actual_room_id})=>{
                this.io.emit('win', {
                    status,
                    room: this.roomInfo[actual_room_id].room
                })
            })

            socket.on('disconnecting', () => {

                this.roomInfo.forEach((room_info) => {
                    
                    if(room_info.host_id == socket.id) {
                        
                        this.io.emit('disconnect-client', {
                            room: room_info.room, 
                            status: 'El host abandonó la partida'
                        });

                        clearInterval(this.clock_interval[room_info.roomid][1]);
                        clearInterval(this.clock_interval[room_info.roomid][0]);
                        this.clock_interval = this.clock_interval.filter(clock => clock[2] != room_info.room)
                        this.roomInfo = this.roomInfo.filter(room => room.host_id != socket.id)

                    }

                    if(room_info.player2_id == socket.id) {
                        
                        this.io.emit('disconnect-client', {
                            room: room_info.room, 
                            status: 'El jugador abandonó la partida'
                        });

                        clearInterval(this.clock_interval[room_info.roomid][1]);
                        clearInterval(this.clock_interval[room_info.roomid][0]);
                        this.clock_interval = this.clock_interval.filter(clock => clock[2] != room_info.room)
                        this.roomInfo = this.roomInfo.filter(room => room.player2_id != socket.id)

                    }

                    console.log(this.clock_interval);
                    console.log(this.roomInfo);
                    this.roomCount = this.roomInfo.length;

                });

            });

            console.log('cliente conectado');
            
        });
    }

}


module.exports = Sockets;