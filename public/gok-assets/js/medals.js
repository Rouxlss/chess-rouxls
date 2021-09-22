let medals = document.querySelectorAll('.medals__list .medals__space');
let info__body = document.querySelectorAll('.info__body');

let lobby__ground_mask = document.querySelector('.lobby__ground_mask');

let bg = [
    '/gok-assets/img/medals/aces-bg.png',
    '/gok-assets/img/medals/trebol-bg.png',
    '/gok-assets/img/medals/corazon-bg.png',
    '/gok-assets/img/medals/diamante-bg.png',
    '/gok-assets/img/medals/espada-bg.png',
    '/gok-assets/img/medals/anima-bg.png',
]

info__body[0].style.opacity =1

medals.forEach((medal, index )=> {


    medal.addEventListener('click', ()=> {

        info__body[index].style.opacity =0
        lobby__ground_mask.style.opacity =0

        setTimeout(() => {
            
            info__body.forEach(e => {
                e.classList.add('d-none')
            });

        }, 100);

        setTimeout(() => {
            lobby__ground_mask.style.opacity =1
            lobby__ground_mask.src = bg[index]
        }, 200);

        setTimeout(() => {
            info__body[index].classList.remove('d-none')
            setTimeout(() => {
                info__body[index].style.opacity =1
            }, 100);
        }, 100);



    })
});