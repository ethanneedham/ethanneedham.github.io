document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector(".hero");

    if (!hero) return;

    hero.addEventListener("click", () => {
        hero.classList.toggle("color-mode");
    });

});