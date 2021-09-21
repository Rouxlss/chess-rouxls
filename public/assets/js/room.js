


let RoomForm = document.querySelector('#RoomForm');
let next = document.querySelector('.next');
let login_room = document.querySelector('.login-room');
let user_room = document.querySelector('.user-room');

next.addEventListener('click', ()=> {
    if(nameUser!='') {
        user_room.classList.add('d-none');
        login_room.classList.remove('d-none');
    }
})

RoomForm.addEventListener('submit', (e)=> {

    let nameUser = document.querySelector('#nameUser').value

    if(nameUser!='') {
        let GameURL = document.querySelector('#GameURL').value;
        e.preventDefault();
        location.href = `${HOST}${GameURL}?name=${nameUser}`
    }

})

let CreateRoom = document.querySelector('#CreateRoom');
let IAGame = document.querySelectorAll('.IAGame');

CreateRoom.addEventListener('click', ()=> {

    let nameUser = document.querySelector('#nameUser').value

    if(nameUser!='') {
        let id = '_' + Math.random().toString(36).substr(2, 20);
        let RoomID = `game${id}chess`;
    
        location.href = `${HOST}${RoomID}?name=${nameUser}`
    }

})

IAGame[0].addEventListener('click', ()=> {

    let nameUser = document.querySelector('#nameUser').value

    if(nameUser!='') {
        location.href = `${HOST}AI?p=white`
    }

})

IAGame[1].addEventListener('click', ()=> {

    let nameUser = document.querySelector('#nameUser').value

    if(nameUser!='') {
        // location.href = `https://chess-server-rouxls.herokuapp.com/${RoomID}?name=${nameUser}`
        location.href = `${HOST}AI?p=black`
    }

})