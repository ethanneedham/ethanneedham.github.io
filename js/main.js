document.addEventListener("DOMContentLoaded", () => {

    const page = document.querySelector("#page");

    if (!page) {
        console.error("PJAX ERROR: missing #page");
        return;
    }

    /* =========================
    GLOBAL STATE RESTORE
    ========================== */

    function reapplyUIState() {

        const theme = localStorage.getItem("theme");
        if (theme) {
            document.documentElement.setAttribute("data-theme", theme);
        }

        const hero = localStorage.getItem("hero");
        if (hero) {
            document.documentElement.setAttribute("data-hero", hero);
        }

    }

    /* =========================
    HERO CLICK (EVENT DELEGATION - FIXED)
    ========================== */

    document.addEventListener("click", (e) => {

        const hero = e.target.closest(".hero");
        if (!hero) return;

        const current = document.documentElement.getAttribute("data-hero") || "color-1";
        const next = current === "color-1" ? "color-2" : "color-1";

        document.documentElement.setAttribute("data-hero", next);
        localStorage.setItem("hero", next);

    });

    /* =========================
    NAVBAR
    ========================== */

    function initNavbar() {

        const navbar = document.querySelector(".navbar");
        if (!navbar) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        window.addEventListener("scroll", () => {

            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {

                const currentY = window.scrollY;

                if (currentY > lastScrollY && currentY > 80) {
                    navbar.classList.add("hidden");
                } else {
                    navbar.classList.remove("hidden");
                }

                lastScrollY = currentY;
                ticking = false;

            });

        }, { passive: true });

    }

    /* =========================
    INIT
    ========================== */

    function reinit() {
        initNavbar();
        reapplyUIState();
    }

    initNavbar();
    reapplyUIState();

    /* =========================
    PJAX STATE
    ========================== */

    let isNavigating = false;

    /* =========================
    CSS LOADER
    ========================== */

    function loadNextCSS(doc) {

        return new Promise((resolve) => {

            const newCSS = doc.querySelector('link[href*="/css/pages/"]');
            if (!newCSS) return resolve();

            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = newCSS.href + "?v=" + Date.now();

            link.onload = () => resolve();

            document.head.appendChild(link);

            setTimeout(resolve, 400);

        });

    }

    /* =========================
    PAGE SWAP
    ========================== */

    async function swapPage(newHTML) {

        page.classList.add("is-out");

        await new Promise(r => setTimeout(r, 160));

        page.innerHTML = newHTML;

        window.scrollTo(0, 0);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                page.classList.remove("is-out");
            });
        });

        reinit();

    }

    /* =========================
    NAVIGATION
    ========================== */

    document.addEventListener("click", async (e) => {

        const link = e.target.closest("a");
        if (!link) return;

        const url = link.getAttribute("href");

        if (
            !url ||
            url.startsWith("http") ||
            url.startsWith("#") ||
            url.startsWith("mailto") ||
            url.startsWith("tel") ||
            link.target === "_blank"
        ) return;

        e.preventDefault();

        if (isNavigating) return;
        isNavigating = true;

        try {

            const res = await fetch(url);
            if (!res.ok) {
                window.location.href = url;
                return;
            }

            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, "text/html");

            const newPage = doc.querySelector("#page");

            if (!newPage) {
                window.location.href = url;
                return;
            }

            document.title = doc.title;

            await loadNextCSS(doc);

            await swapPage(newPage.innerHTML);

            window.history.pushState({}, "", url);

        } catch (err) {

            console.error("PJAX ERROR:", err);
            window.location.href = url;

        } finally {
            isNavigating = false;
        }

    });

    /* =========================
    BACK BUTTON
    ========================== */

    window.addEventListener("popstate", async () => {

        const url = location.href;

        try {

            const res = await fetch(url);
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, "text/html");

            const newPage = doc.querySelector("#page");

            if (!newPage) {
                location.reload();
                return;
            }

            document.title = doc.title;

            await loadNextCSS(doc);

            page.innerHTML = newPage.innerHTML;

            window.scrollTo(0, 0);

            reinit();

        } catch (err) {
            console.error(err);
            location.reload();
        }

    });

});