window.addEventListener("scroll", () => {
    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = maxScroll > 0
        ? window.scrollY / maxScroll
        : 0;

    // Make the descent more aggressive
    const darkness = Math.pow(progress, 0.7);

    document.documentElement.style.setProperty(
        "--abyss-darkness",
        darkness
    );
});


document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. INK CURSOR GLOW
    // =====================================

    const cursorGlow = document.createElement("div");
    cursorGlow.classList.add("ink-cursor");

    document.body.appendChild(cursorGlow);

    document.addEventListener("mousemove", (e) => {

        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;

    });


    // =====================================
    // 2. FLOATING INK PARTICLES
    // =====================================

    const symbols = [
        "≈", "⟡", "✦", "𓆝",
        "𓆟", "◈", "◇", "☽"
    ];

    function createInkParticle() {

        const particle = document.createElement("span");

        particle.classList.add("ink-particle");

        particle.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.left = Math.random() * 100 + "vw";

        particle.style.animationDuration =
            (16 + Math.random() * 14) + "s";

        particle.style.fontSize =
            (12 + Math.random() * 18) + "px";

        particle.style.opacity =
            (0.08 + Math.random() * 0.17);

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 30000);

    }

    let particleInterval;

    function startParticles() {

        if (!particleInterval) {
            particleInterval = setInterval(
                createInkParticle,
                2600
            );
        }

    }

    function stopParticles() {

        clearInterval(particleInterval);
        particleInterval = null;

    }

    startParticles();

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            stopParticles();
        } else {
            startParticles();
        }

    });


    // =====================================
    // 3. MANUSCRIPT REVEAL
    // =====================================

    const revealElements = document.querySelectorAll(
        ".story, .document-group, .archive-entry, .closing-note"
    );

    revealElements.forEach(element => {
        element.classList.add("ink-reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("ink-visible");

                    revealObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // =====================================
    // 4. ABYSS READING PROGRESS
    // =====================================

    const progressBar = document.createElement("div");

    progressBar.classList.add("ink-progress");

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
    // 5. ARCHIVE ENTRY HOVER
    // =====================================

    const archiveEntries =
        document.querySelectorAll(".archive-entry");

    archiveEntries.forEach(entry => {

        entry.addEventListener("mouseenter", () => {

            entry.classList.add("ink-awakened");

        });

        entry.addEventListener("mouseleave", () => {

            entry.classList.remove("ink-awakened");

        });

    });


    // =====================================
    // 6. LEVIATHAN MANUSCRIPT GLOW
    // =====================================

    const documents =
        document.querySelectorAll(".document-group iframe");

    documents.forEach(frame => {

        frame.addEventListener("mouseenter", () => {

            frame.classList.add("leviathan-awakened");

        });

        frame.addEventListener("mouseleave", () => {

            frame.classList.remove("leviathan-awakened");

        });

    });


    // =====================================
    // 7. TOP-OF-PAGE RETURN EFFECT
    // =====================================

    const topLink = document.querySelector(
        'a[href="#top"]'
    );

    if (topLink) {

        topLink.addEventListener("click", () => {

            document.body.classList.add("returning-surface");

            setTimeout(() => {
                document.body.classList.remove("returning-surface");
            }, 1200);

        });

    }

});
