


let RoomForm = document.querySelector('#RoomForm');

RoomForm.addEventListener('submit', (e)=> {

    let nameUser = document.querySelector('#nameUser').value

    if(nameUser!='') {
        let GameURL = document.querySelector('#GameURL').value;
        e.preventDefault();
        location.href = `http://localhost:8080/${GameURL}?name=${nameUser}`
    }

})

let CreateRoom = document.querySelector('#CreateRoom');

CreateRoom.addEventListener('click', ()=> {

    let nameUser = document.querySelector('#nameUser').value

    if(nameUser!='') {
        let id = '_' + Math.random().toString(36).substr(2, 20);
        let RoomID = `game${id}chess`;
    
        location.href = `http://localhost:8080/${RoomID}?name=${nameUser}`
    }
    


})