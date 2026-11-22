
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. CURSED BLUE CURSOR GLOW
    // =====================================

    const cursorGlow = document.createElement("div");
    cursorGlow.classList.add("cursed-cursor");
    document.body.appendChild(cursorGlow);

    document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });


    // =====================================
    // 2. FLOATING ANCIENT SYMBOLS
    // =====================================

    const symbols = [
        "ᚦ", "ᛉ", "ᚱ", "ᛟ",
        "✧", "⛧", "◈", "◇",
        "𖤐", "✦"
    ];

    function createParticle() {

        const particle = document.createElement("span");

        particle.classList.add("cursed-particle");

        particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.left = Math.random() * 100 + "vw";

        particle.style.animationDuration =
            (15 + Math.random() * 15) + "s";

        particle.style.fontSize =
            (12 + Math.random() * 16) + "px";

        particle.style.opacity =
            (0.08 + Math.random() * 0.18);

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 30000);
    }

    const particleInterval = setInterval(createParticle, 2500);


    // =====================================
    // 3. SCROLL REVEAL
    // =====================================

    const revealElements = document.querySelectorAll(
        ".story, .document-group, .archive-entry, .closing-note"
    );

    revealElements.forEach(element => {
        element.classList.add("cursed-reveal");
    });

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("cursed-visible");

                revealObserver.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // =====================================
    // 4. READING PROGRESS BAR
    // =====================================

    const progressBar = document.createElement("div");

    progressBar.classList.add("cursed-progress");

    document.body.appendChild(progressBar);

    function updateProgress() {

        const scrollTop = window.scrollY;

        const scrollHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = scrollHeight > 0
            ? (scrollTop / scrollHeight) * 100
            : 0;

        progressBar.style.width = progress + "%";
    }

    window.addEventListener("scroll", updateProgress);

    updateProgress();


    // =====================================
    // 5. CURSED ARCHIVE ENTRIES
    // =====================================

    const archiveEntries =
        document.querySelectorAll(".archive-entry");

    archiveEntries.forEach(entry => {

        entry.addEventListener("mouseenter", () => {

            entry.classList.add("cursed-active");

        });

        entry.addEventListener("mouseleave", () => {

            entry.classList.remove("cursed-active");

        });

    });


    // =====================================
    // 6. RELIC DOCUMENT GLOW
    // =====================================

    const documents =
        document.querySelectorAll(".document-group iframe");

    documents.forEach(documentFrame => {

        documentFrame.addEventListener("mouseenter", () => {

            documentFrame.classList.add("relic-awakened");

        });

        documentFrame.addEventListener("mouseleave", () => {

            documentFrame.classList.remove("relic-awakened");

        });

    });


    // =====================================
    // 7. REDUCE EFFECTS WHEN TAB IS HIDDEN
    // =====================================

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            clearInterval(particleInterval);
        }

    });

});
