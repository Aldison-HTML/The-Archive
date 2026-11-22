
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. MAGICAL CURSOR GLOW
    // =====================================

    const cursorGlow = document.createElement("div");
    cursorGlow.classList.add("cursor-glow");
    document.body.appendChild(cursorGlow);

    document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });


    // =====================================
    // 2. SCROLL REVEAL
    // =====================================

    const revealElements = document.querySelectorAll(
        ".story, .document-group, .archive-entry, .closing-note"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
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
    // 3. FLOATING ARCANE SYMBOLS
    // =====================================

    const symbols = [
        "ᚠ", "ᚱ", "ᚷ", "ᛉ", "ᛟ",
        "✧", "✦", "☽", "⚝", "✵"
    ];

    function createRune() {

        const rune = document.createElement("span");

        rune.classList.add("arcane-rune");

        rune.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        rune.style.left = Math.random() * 100 + "vw";

        rune.style.animationDuration =
            (12 + Math.random() * 12) + "s";

        rune.style.fontSize =
            (14 + Math.random() * 15) + "px";

        rune.style.opacity =
            (0.1 + Math.random() * 0.2);

        document.body.appendChild(rune);

        setTimeout(() => {
            rune.remove();
        }, 25000);
    }

    setInterval(createRune, 1800);


    // =====================================
    // 4. GRIMOIRE HOVER EFFECT
    // =====================================

    const archiveEntries = document.querySelectorAll(".archive-entry");

    archiveEntries.forEach(entry => {

        entry.addEventListener("mouseenter", () => {
            entry.style.boxShadow =
                "0 0 20px rgba(190, 153, 88, 0.15)";
        });

        entry.addEventListener("mouseleave", () => {
            entry.style.boxShadow = "none";
        });

    });


    // =====================================
    // 5. READING PROGRESS BAR
    // =====================================

    const progressBar = document.createElement("div");

    progressBar.classList.add("reading-progress");

    document.body.appendChild(progressBar);

    function updateProgress() {

        const scrollTop = window.scrollY;

        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress =
            scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        progressBar.style.width = progress + "%";
    }

    window.addEventListener("scroll", updateProgress);

    updateProgress();

});
