let RoomId = document.querySelector("#RoomId");
let gameURL = window.location.href.split("/");
let room = gameURL[3];

if (room.length == 0) {
    // location.href = `http://localhost:4000/room`
    location.href = `https://chess-server-rouxls.herokuapp.com/room`;
}

let username = room.split("=");
username = username[1];

console.log(username);

room = room.split("?");
room = room[0];

RoomId.value = room;

const copy_chess_id = () => {
    /* Get the text field */
    /* Select the text field */
    RoomId.select();
    RoomId.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(RoomId.value);

    /* Alert the copied text */
    alert("Copied the text: " + RoomId.value);
};

const btn = document.querySelector(".copy-button");

btn.addEventListener("click", copy_chess_id);

// function makeRandomMove () {
//   var possibleMoves = game.moves({
//     verbose: true
//   })

//   // game over
//   if (possibleMoves.length === 0) return
//
//   var randomIdx = Math.floor(Math.random() * possibleMoves.length)
//   var move = possibleMoves[randomIdx]
//   game.move(move.san)

//   // highlight black's move
//   removeHighlights('black')
//   $board.find('.square-' + move.from).addClass('highlight-black')
//   squareToHighlight = move.to

//   // update the board to the new position
//   board.position(game.fen())
// }

let actual_room_id = null;
let global_fen = null;

let player_type = null;

var board = null;
var $board = $("#myBoard");
var game = new Chess();

var squareToHighlight = null;
var squareClass = "square-55d63";

var whiteSquareGrey = "#a9a9a9";
var blackSquareGrey = "#696969";

function removeGreySquares() {
    $("#myBoard .square-55d63").css("background", "");
}

function greySquare(square) {
    var $square = $("#myBoard .square-" + square);

    var background = whiteSquareGrey;
    if ($square.hasClass("black-3c85d")) {
        background = blackSquareGrey;
    }

    $square.css("background", background);
}

function removeHighlights(color) {
    $board.find("." + squareClass).removeClass("highlight-" + color);
}

function onDragStart(source, piece) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false;

    // or if it's not that side's turn
    if (
        (game.turn() === "w" && piece.search(/^b/) !== -1) ||
        (game.turn() === "b" && piece.search(/^w/) !== -1) ||
        (game.turn() === "b" && player_type == 0) ||
        (game.turn() === "w" && player_type == 1)
    ) {
        return false;
    } else {
        if (game.turn() == "w") {
            socket.emit("time-discount", {
                player: 0,
                actual_room_id,
                room,
            });
        }

        if (game.turn() == "b") {
            socket.emit("time-discount", {
                player: 1,
                actual_room_id,
                room,
            });
        }
    }
}

function onDrop(source, target) {
    removeGreySquares();

    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: "q", // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return "snapback";
    else socket.emit("move", { move: move, board: game.fen(), room: room });

    if (game.turn() == "b") {
        socket.emit("time-stop", {
            player: 0,
            actual_room_id,
            room,
        });

        socket.emit("time-discount", {
            player: 1,
            actual_room_id,
            room,
        });
    }

    if (game.turn() == "w") {
        socket.emit("time-stop", {
            player: 1,
            actual_room_id,
            room,
        });

        socket.emit("time-discount", {
            player: 0,
            actual_room_id,
            room,
        });
    }

    // highlight white's move
    removeHighlights("white");
    $board.find(".square-" + source).addClass("highlight-white");
    $board.find(".square-" + target).addClass("highlight-white");

    // make random move for black
    updateStatus();
    // console.log(game.turn())
    // window.setTimeout(makeRandomMove, 250)
}

function onMoveEnd() {
    $board.find(".square-" + squareToHighlight).addClass("highlight-black");
}

function onMouseoverSquare(square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over

    if (game.turn() == "w" && player_type == 0) {
        greySquare(square);
        for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to);
        }
    }

    if (game.turn() == "b" && player_type == 1) {
        greySquare(square);
        for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to);
        }
    }
}

function onMouseoutSquare(square, piece) {
    removeGreySquares();
}

function onSnapEnd() {
    board.position(game.fen());
}

function updateStatus() {
    var status = "";

    var moveColor = "White";
    if (game.turn() === "b") {
        moveColor = "Black";
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = "Game over, " + moveColor + " is in checkmate.";
        socket.emit("checkmate", { status, actual_room_id });
    }

    // draw?
    else if (game.in_draw()) {
        status = "Game over, drawn position";
        socket.emit("drawn", status);
    }

    // game still on
    else {
        status = moveColor + " to move";

        // check?
        if (game.in_check()) {
            status += ", " + moveColor + " is in check";
        }
    }
}

socket.on("welcome", ({ roomCount }) => {
    socket.emit("room", {
        room,
        player: username,
        roomid: roomCount,
    });
});

socket.on("match", (room_info) => {
    let game_room = document.querySelector(".game-room");

    if (room_info.room == room) {
        game_room.classList.add("d-none");
        name_white_player.innerHTML = room_info.host_name;
        name_black_player.innerHTML = room_info.player2_name;

        actual_room_id = room_info.roomid;
        global_fen = room_info.fen;
    }
});

let name_white_player = document.querySelector(".name-white-player");
let name_black_player = document.querySelector(".name-black-player");

let white_clock = document.querySelector(".time-white-player");
let black_clock = document.querySelector(".time-black-player");

socket.on("second-player", ({ second_player, fen }) => {
    if (second_player == true) {
        let config = {
            position: "start",
            draggable: true,
            orientation: "black",
            onDragStart: onDragStart,
            onDrop: onDrop,
            onMoveEnd: onMoveEnd,
            onSnapEnd: onSnapEnd,
            onMouseoutSquare: onMouseoutSquare,
            onMouseoverSquare: onMouseoverSquare,
        };

        board = Chessboard("myBoard", config);

        name_white_player.classList.add("second-player-white-name");
        name_black_player.classList.add("second-player-black-name");

        white_clock.classList.add("second-player-white-time");
        black_clock.classList.add("second-player-black-time");

        player_type = 1;
    }
});

socket.on("first-player", ({ first_player, fen }) => {
    if (first_player == true) {
        let config = {
            position: "start",
            draggable: true,
            orientation: "white",
            onDragStart: onDragStart,
            onDrop: onDrop,
            onMoveEnd: onMoveEnd,
            onSnapEnd: onSnapEnd,
            onMouseoutSquare: onMouseoutSquare,
            onMouseoverSquare: onMouseoverSquare,
        };

        board = Chessboard("myBoard", config);

        name_white_player.classList.add("first-player-white-name");
        name_black_player.classList.add("first-player-black-name");

        white_clock.classList.add("first-player-white-time");
        black_clock.classList.add("first-player-black-time");

        player_type = 0;
    }
});

// MOVE PIECE

socket.on("move", (msg) => {
    if (msg.room == room) {
        game.move(msg.move);
        board.position(game.fen());
    }
});

// UPDATE TIME

socket.on("update-white-time", (data) => {
    if (data.room == room) {
        white_clock.innerHTML = data.white;
    }
});

socket.on("update-black-time", (data) => {
    if (data.room == room) {
        black_clock.innerHTML = data.black;
    }
});

// FULL ROOM

socket.on("full", ({ msg, full }) => {
    let main = document.querySelector("main");
    if (full) {
        main.innerHTML = `<div class='container row mt-5 d-flex justify-content-center'></div>
		<h2 class='text-center text-white'>SALA LLENA :(</h2>
		<br>

		<div class='col text-center'>
		  <a class='btn btn-danger text-center' href='/room'>REGRESAR</a>
		</div>
	  </div>`;
    }
});

socket.on("win", (data) => {
    if (data.room == room) {
        console.log(data.status);

        let win_alert = document.querySelector(".win-alert");
        win_alert.classList.remove("d-none");
        win_alert.querySelector(".win-alert-message").innerHTML = data.status;

        setTimeout(() => {
            win_alert.classList.add("op1");
        }, 100);
    }
});

socket.on("disconnect-client", (data) => {
    if (data.room == room) {
        console.log(data.status);

        let win_alert = document.querySelector(".win-alert");
        win_alert.classList.remove("d-none");
        win_alert.querySelector(".win-alert-message").innerHTML = data.status;

        setTimeout(() => {
            win_alert.classList.add("op1");
        }, 100);
    }
});
