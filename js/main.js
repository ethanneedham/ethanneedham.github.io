document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {

        const currentY = window.scrollY;

        if (currentY > lastScrollY && currentY > 80) {
            navbar.classList.add("hidden");
        } else {
            navbar.classList.remove("hidden");
        }

        lastScrollY = currentY;

    });

});