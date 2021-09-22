const lobby__main_character = document.querySelector('.lobby__main_character');
const lobby__main_bg_character = document.querySelector('.lobby__main_bg_character');

const lobby_left_arrow = document.querySelector('.lobby__main_left-arrow')
const lobby_right_arrow = document.querySelector('.lobby__main_right-arrow')

let character_count = 0;

const characters = [
    'peon-negro',
    'peon-blanco',
    'reina-blanca',
    'reina-negra',
    'rey-negro',
    'rey-blanco',
    'alfil-blanco',
    'alfil-negro',
]

const validate_arrows = () => {

    if(character_count == 0) {
        lobby_left_arrow.style.display = 'none';
    }else {
        lobby_left_arrow.style.display = 'block';
    }    

    if(character_count == 7) {
        lobby_right_arrow.style.display = 'none';
    }else {
        lobby_right_arrow.style.display = 'block';
    }    

}

const show_character = (index) => {

    lobby__main_character.src = `/gok-assets/img/characters/${characters[index]}.png`;
    lobby__main_bg_character.src = `/gok-assets/img/characters/${characters[index]}.png`;

    lobby__main_bg_character.style.transition = 0 + 's'
    lobby__main_bg_character.style.opacity = 0
    setTimeout(() => {
        lobby__main_bg_character.style.transition = 1 + 's'
        lobby__main_bg_character.style.opacity = .3
    }, 100);

}

const show_next_character = () => {
    lobby__main_character.style.transition = 0 + 's'
    lobby__main_character.style.opacity = 0
    lobby__main_character.style.transform = 'translateX(100px)'
    setTimeout(() => {
        lobby__main_character.style.transition = .5 + 's'
        lobby__main_character.style.opacity = 1
        lobby__main_character.style.transform = 'translateX(0px)'
    }, 100);
}

const show_prev_character = () => {
    lobby__main_character.style.transition = 0 + 's'
    lobby__main_character.style.opacity = 0
    lobby__main_character.style.transform = 'translateX(-100px)'
    setTimeout(() => {
        lobby__main_character.style.transition = .5 + 's'
        lobby__main_character.style.opacity = 1
        lobby__main_character.style.transform = 'translateX(0px)'
    }, 100);
}

validate_arrows();

lobby__main_character.src = `/gok-assets/img/characters/${characters[0]}.png`;
lobby__main_bg_character.src = `/gok-assets/img/characters/${characters[0]}.png`;

lobby_right_arrow.addEventListener('click', ()=> {
    character_count++;
    validate_arrows();
    show_character(character_count);
    show_next_character();
})

lobby_left_arrow.addEventListener('click', ()=> {
    character_count--;
    validate_arrows();
    show_character(character_count);
    show_prev_character()
})

let col_weapons = document.querySelectorAll('.col-wapons');

col_weapons[0].addEventListener('click', (e)=> {

    let level = e.target.parentElement.querySelector('.nivel_herreria');

    document.querySelectorAll('.nivel_herreria').forEach(e => {
        e.style.opacity = 0
        setTimeout(() => {
            e.classList.add('d-none')
        }, 100);
    });

    setTimeout(() => {
        level.classList.remove('d-none')
        setTimeout(() => {
            level.style.opacity = 1
        }, 100);
    }, 100);

    
})

col_weapons[1].addEventListener('click', (e)=> {

    let level = e.target.parentElement.querySelector('.nivel_herreria');

    document.querySelectorAll('.nivel_herreria').forEach(e => {
        e.style.opacity = 0
        setTimeout(() => {
            e.classList.add('d-none')
        }, 100);
    });

    setTimeout(() => {
        level.classList.remove('d-none')
        setTimeout(() => {
            level.style.opacity = 1
        }, 100);
    }, 100);

})

window.addEventListener("click", function (e) {
    
    if (col_weapons[0].contains(e.target) || col_weapons[1].contains(e.target)) {



    }else {
        document.querySelectorAll('.nivel_herreria').forEach(e => {
            e.style.opacity = 0
            setTimeout(() => {
                e.classList.add('d-none')
            }, 100);
        });
    }

  });