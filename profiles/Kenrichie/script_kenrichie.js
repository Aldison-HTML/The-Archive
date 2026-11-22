
/* =========================================
   INITIAL SETTINGS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================
       CURSOR GLOW
    ===================================== */

    const cursor = document.createElement("div");

    cursor.classList.add("cursor-glow");

    document.body.appendChild(cursor);

    if (!reducedMotion) {

        document.addEventListener("mousemove", (event) => {

            cursor.style.left = event.clientX + "px";
            cursor.style.top = event.clientY + "px";

        });

    }


    /* =====================================
       READING PROGRESS BAR
    ===================================== */

    const progress = document.createElement("div");

    progress.classList.add("reading-progress");

    document.body.appendChild(progress);


    function updateProgress() {

        const scrollTop = window.scrollY;

        const pageHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percentage = pageHeight > 0
            ? (scrollTop / pageHeight) * 100
            : 0;

        progress.style.width = percentage + "%";

    }

    window.addEventListener("scroll", updateProgress);

    updateProgress();


    /* =====================================
       SCROLL REVEAL
    ===================================== */

    const revealElements = document.querySelectorAll(
        ".story, .document-group, .archive-entry, .closing-note, .quote"
    );

    revealElements.forEach((element) => {

        element.classList.add("reveal");

    });


    if (!reducedMotion && "IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add("visible");

        });

    }


    /* =====================================
       FLOATING PAGES
    ===================================== */

    const pageSymbols = ["✧", "❧", "✦", "◇", "✥"];

    function createFloatingPage() {

        const page = document.createElement("div");

        page.classList.add("floating-page");

        page.textContent =
            pageSymbols[
                Math.floor(Math.random() * pageSymbols.length)
            ];

        const size = Math.random() * 18 + 12;

        const duration = Math.random() * 12 + 12;

        page.style.left = Math.random() * 100 + "vw";

        page.style.fontSize = size + "px";

        page.style.animationDuration = duration + "s";

        page.style.opacity = Math.random() * 0.3 + 0.2;

        document.body.appendChild(page);

        setTimeout(() => {

            page.remove();

        }, duration * 1000);

    }


    if (!reducedMotion) {

        // Create a few pages immediately.

        for (let i = 0; i < 5; i++) {

            setTimeout(createFloatingPage, i * 1000);

        }

        // Continue creating floating pages.

        setInterval(createFloatingPage, 2500);

    }


    /* =====================================
       ACTIVE ARCHIVE VOLUME
    ===================================== */

    const volumeLinks = document.querySelectorAll(
        ".archive-link"
    );

    const volumes = document.querySelectorAll(
        "#vol1, #vol2, #vol3"
    );


    function setActiveVolume(id) {

        volumeLinks.forEach((link) => {

            const entry = link.querySelector(".archive-entry");

            if (!entry) return;

            if (link.getAttribute("href") === "#" + id) {

                entry.classList.add("active");

            } else {

                entry.classList.remove("active");

            }

        });

    }


    if ("IntersectionObserver" in window) {

        const volumeObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        setActiveVolume(entry.target.id);

                    }

                });

            },
            {
                rootMargin: "-20% 0px -65% 0px"
            }
        );

        volumes.forEach((volume) => {

            volumeObserver.observe(volume);

        });

    }


    /* =====================================
       ARCHIVE LINK CLICK EFFECT
    ===================================== */

    volumeLinks.forEach((link) => {

        link.addEventListener("click", () => {

            const target = link.getAttribute("href").substring(1);

            setActiveVolume(target);

        });

    });


});
