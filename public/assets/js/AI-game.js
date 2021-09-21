let play_again = document.querySelector('.play_again');
play_again.href = window.location.href;

let gameURL = window.location.href.split("=");
let player_type_url = gameURL[1];

if (player_type_url.length == 0) {
    location.href = `${HOST}room`
}

function makeRandomMove() {
    var possibleMoves = game.moves({
        verbose: true,
    });

    // game over
    if (possibleMoves.length === 0) return;

    var randomIdx = Math.floor(Math.random() * possibleMoves.length);
    var move = possibleMoves[randomIdx];
    game.move(move.san);

    // highlight black's move
    removeHighlights("black");
    $board.find(".square-" + move.from).addClass("highlight-black");
    squareToHighlight = move.to;

    // update the board to the new position
    board.position(game.fen());
}

const win_msg = (status) => {

    let win_alert = document.querySelector(".win-alert");
    win_alert.classList.remove("d-none");
    win_alert.querySelector(".mgs-text").innerHTML = status;

    setTimeout(() => {
        win_alert.classList.add("op1");
    }, 100);

}

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
        (game.turn() === "b" && piece.search(/^w/) !== -1)
    ) {
        return false;
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

    // highlight white's move
    removeHighlights("white");
    $board.find(".square-" + source).addClass("highlight-white");
    $board.find(".square-" + target).addClass("highlight-white");

    // make random move for black
    updateStatus();
    // console.log(game.turn())
    window.setTimeout(makeRandomMove, 250)
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
    greySquare(square);
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
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
        win_msg(status)
    }

    // draw?
    else if (game.in_draw()) {
        status = "Game over, drawn position";
        win_msg(status)
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


let config = {
    position: "start",
    draggable: true,
    orientation: player_type_url,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMoveEnd: onMoveEnd,
    onSnapEnd: onSnapEnd,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
};

board = Chessboard("myBoard", config);

if(player_type_url == 'black') {
    window.setTimeout(makeRandomMove, 1000)
}

