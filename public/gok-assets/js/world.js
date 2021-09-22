const left_arrow = document.querySelector('.worlds_left-arrow')
const right_arrow = document.querySelector('.worlds_right-arrow')

const world__blocks = document.querySelector('.world__blocks');

let world_count = 0;

const validate_arrows = () => {

    if(world_count == 0) {
        left_arrow.style.display = 'none';
    }else {
        left_arrow.style.display = 'block';
    }    

    if(world_count == 2) {
        right_arrow.style.display = 'none';
    }else {
        right_arrow.style.display = 'block';
    }    

}

const move_worlds = (index) => {

    let per = index*3;
    world__blocks.style.transform = `translateX(-${per}${per}%)`
}

validate_arrows();

right_arrow.addEventListener('click', ()=> {
    world_count++;
    validate_arrows();
    move_worlds(world_count)
})

left_arrow.addEventListener('click', ()=> {
    world_count--;
    validate_arrows();
    move_worlds(world_count)

})


