home__btn = document.querySelector(".home__btn");
home__menu = document.querySelector(".home__menu");

window.addEventListener("click", function (e) {
    
    if (home__btn.contains(e.target) || home__menu.contains(e.target)) {
      home__menu.classList.remove("d-none");
    } else {
      home__menu.classList.add("d-none");
    }

  });