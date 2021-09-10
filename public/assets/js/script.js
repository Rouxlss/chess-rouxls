let chessboard = document.querySelector("#chessboard");
let chess_board = "";

let chess_letter = ["A", "B", "C", "D", "E", "F", "G", "H"];
let chess_number = [1, 2, 3, 4, 5, 6, 7, 8];

let chess_pieces_name = [
  ["tower", "horse", "alfil", "queen", "king", "alfil", "horse", "tower"],
  ["peon", "peon", "peon", "peon", "peon", "peon", "peon", "peon"],
];

let chess_pieces_id = [
  ["tower1", "horse1", "alfil1", "queen", "king", "alfil2", "horse2", "tower2"],
  ["peon1", "peon2", "peon3", "peon4", "peon5", "peon6", "peon7", "peon8"],
];

// Create board

for (let i = 7; i >= 0; i--) {
  chess_board += `<div class="cb-row">`;

  if (i % 2 == 0) {
    for (let j = 0; j < 8; j++) {
      let id = chess_letter[j] + chess_number[i];

      chess_board += `
            <div class="cb-cell first-color" id="${id}">
                <div class="letter">${id}</div>
            </div>`;
    }
  } else {
    for (let j = 0; j < 8; j++) {
      let id = chess_letter[j] + chess_number[i];

      chess_board += `
            <div class="cb-cell second-color" id="${id}">
                <div class="letter">${id}</div>
            </div>`;
    }
  }

  chess_board += `</div>`;
}

chessboard.innerHTML += chess_board;

// put pieces

const create_piece = (i, j, type, chess_pieces_name) => {
  let piece = `
    <div class="piece ${type}" id="${type}-${chess_pieces_id[i][j]}">
        <img class="piece_img" src="./assets/img/pieces/${type}-${chess_pieces_name[i][j]}.png">
    </div>
    `;

  return piece;
};

let rows = document.querySelectorAll(".cb-row");

for (let i = 0; i < 2; i++) {
  for (let j = 0; j < 8; j++) {
    let piece = create_piece(i, j, "black", chess_pieces_name);
    rows[i].querySelectorAll(".cb-cell")[j].innerHTML += piece;
  }
}

for (let i = 1; i >= 0; i--) {
  for (let j = 0; j < 8; j++) {
    let piece = create_piece(i, j, "white", chess_pieces_name);
    rows[7 - i].querySelectorAll(".cb-cell")[j].innerHTML += piece;
  }
}

let game_cells = document.querySelectorAll(".cb-cell");

let game = [];
let row = [];

// COnfigurando la matriz del juego

for (let i = 1; i <= game_cells.length; i++) {
  row.push(game_cells[i - 1]);
  if (i % 8 == 0) {
    game.push(row);
    row = [];
  }
}

console.log({ game });

const sound = () => {
  let audio = new Audio("./assets/audio/take-piece.mp3");
  audio.play();
};

let pieces;
let cells;

const init_variables = () => {
  pieces = document.querySelectorAll(".piece");
  cells = document.querySelectorAll(".cb-cell");
};

init_variables();

let selected_piece = "";
let selected_piece_type = "";
let moved = false;
let moved_to_white_space = false;

let turn = 1;

let sides = document.querySelectorAll(".side");
let alert_msg = document.querySelector(".alert");

const alert_animation = () => {
  alert_msg.style.opacity = 1;
  setTimeout(() => {
    alert_msg.style.opacity = 0;
  }, 1500);
};

// TIME

  let white_time = [5,0];
  let black_time = [5,0];

  let white_clock = document.querySelector('.time-white-player')
  let black_clock = document.querySelector('.time-black-player')

  let clock_interval;

  const clock = ( time, clock ) => {

    clock_interval = setInterval(() => {
      
      time[1]--;
      if(time[1]<0){
        time[1]=59;
        time[0]--
      }

      clock.innerHTML = `${time[0]}:${('00' + time[1]).slice(-2)}` 
      console.log(white_time);

      socket.emit('update-time', {
        white: white_clock.innerHTML,
        black: black_clock.innerHTML,
      })

    }, 1000);

  }

  const stop_clock = () => {
    clearInterval(clock_interval);
  }


// TIME

const pieces_engine = () => {
  pieces.forEach((piece) => {
    piece.addEventListener("click", () => {

      pieces.forEach((piece) => {
        piece.classList.remove("selected");
      });

      game.forEach((row) => {
        for (let i = 0; i < row.length; i++) {
          row[i].lastElementChild.id == piece.id
            ? console.log("Pieza seleccionada: ", piece)
            : null;
        }
      });

      const config_move = () => {
        if (piece.parentElement.children.length == 2) {
          piece.classList.add("selected");
          sound();
          setTimeout(() => {
            selected_piece = piece;
            selected_piece_type = piece.classList[1];
            // console.log(`pieza ${piece.id} seleccionada `);
          }, 100);
        }
      };

      if (turn == 1 && piece.classList[1] == "white") {
        config_move();

        stop_clock();
        clock(white_time, white_clock);

        socket.emit("change-turn", {
            player_turn: 2,
        });

      } else if (turn == 2 && piece.classList[1] == "black") {

        config_move();

        stop_clock();
        clock(black_time, black_clock);

        socket.emit("change-turn", {
            player_turn: 1,
        });

      } else if (turn == 2 && piece.classList[1] == "white") {
        alert_msg.querySelector("p").innerHTML =
          "No puedes mover, es el turno de las negras";
        alert_animation();
      } else if (turn == 1 && piece.classList[1] == "black") {
        alert_msg.querySelector("p").innerHTML =
          "No puedes mover, es el turno de las blancas";
        alert_animation();
      }

      // console.log("id: " + piece.id);
      // console.log("piece: " + piece.parentElement.id);
    });
  });
};

const cell_engine = () => {
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      // console.log("id cell: " + cell.id);
      // console.log("Lenght: " + cell.children.length);

      const move_piece = (index) => {

        let piece_img = selected_piece.querySelector("img").src;
        let cell_id = cell.id;

        let move = `<li><img src="${piece_img}" alt=""> <span>${cell_id}</span></li>`;
        sides[index].innerHTML += move;

        cell.append(selected_piece);
        selected_piece = "";
        sound();

        pieces.forEach((piece) => {
          piece.classList.remove("selected");
        });

        setTimeout(() => {
          selected_piece = "";
          selected_piece_type = "";
        }, 100);

        socket.emit("move-piece", {
          data: chessboard.innerHTML,
        });
      };

      if (selected_piece != "" && cell.children.length == 1) {
        // console.log("Lenght: " + cell.childNodes.length);

        if (selected_piece_type == "white") {
          move_piece(0);
          stop_clock();
          clock(black_time, black_clock);
        } else if (selected_piece_type == "black") {
          move_piece(1);
          stop_clock();
          clock(white_time, white_clock);

        }
      } else if (selected_piece != "" && cell.children.length == 2) {
        if (
          cell.querySelector(".piece").classList.contains("black") &&
          selected_piece_type == "white"
        ) {
          let parent_black_piece = cell.querySelector(".black").parentElement;
          let black_piece = parent_black_piece.querySelector(".black");
          black_piece.remove();
          move_piece(0);

          socket.emit("change-turn", {
            player_turn: 2,
          });

        } else if (
          cell.querySelector(".piece").classList.contains("white") &&
          selected_piece_type == "black"
        ) {
          let parent_white_piece = cell.querySelector(".white").parentElement;
          let white_piece = parent_white_piece.querySelector(".white");
          white_piece.remove();
          move_piece(1);

          socket.emit("change-turn", {
            player_turn: 1,
          });
        }
      }

      // console.log("child count: " + cell.childElementCount);
    });
  });
};

pieces_engine();
cell_engine();

/// Para emitir
// socket.emit('mensaje-to-server', { data });

// Para escuchar
socket.on("welcome", (data) => {
  console.log(data);
});

socket.on("change-turn", (player_turn) => {
    console.log('turno: ' + player_turn);
    turn = player_turn;
});

socket.on("move-piece", (data) => {
  chessboard.innerHTML = data;
  init_variables();
  pieces_engine();
  cell_engine();
  sound();
});


socket.on('update-time', (data)=>{
  white_clock.innerHTML = data.white;
  black_clock.innerHTML = data.black;
})

