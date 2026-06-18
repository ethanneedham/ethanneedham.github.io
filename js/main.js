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

// =========================
// AMBIENT AUDIO SYSTEM
// =========================

document.addEventListener("DOMContentLoaded", () => {

    const audio = document.getElementById("ambient-audio");

    if (!audio) return;

    audio.volume = 0;

    let isPlaying = false;

    const fadeIn = () => {
        audio.play().catch(() => {
            // browsers may block autoplay until first interaction
        });

        let vol = 0;
        audio.volume = 0;

        const fade = setInterval(() => {
            if (vol < 0.25) {
                vol += 0.01;
                audio.volume = vol;
            } else {
                clearInterval(fade);
            }
        }, 30);
    };

    const fadeOut = () => {
        let vol = audio.volume;

        const fade = setInterval(() => {
            if (vol > 0.01) {
                vol -= 0.01;
                audio.volume = vol;
            } else {
                audio.pause();
                clearInterval(fade);
            }
        }, 30);
    };

    document.addEventListener("click", () => {

        isPlaying = !isPlaying;

        if (isPlaying) {
            fadeIn();
        } else {
            fadeOut();
        }

    });

});