
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. ABYSS DESCENT / DARKENING
    // =====================================

    let ticking = false;

    function updateAbyss() {

        const maxScroll =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = maxScroll > 0
            ? window.scrollY / maxScroll
            : 0;

        // Gradually increase darkness
        const darkness = Math.pow(progress, 0.85);

        document.documentElement.style.setProperty(
            "--abyss-darkness",
            darkness.toFixed(4)
        );

        // Update reading progress
        progressBar.style.width =
            (progress * 100) + "%";

        ticking = false;
    }

    window.addEventListener("scroll", () => {

        if (!ticking) {

            window.requestAnimationFrame(updateAbyss);

            ticking = true;

        }

    }, { passive: true });


    // =====================================
    // 2. INK CURSOR GLOW
    // =====================================

    const cursorGlow = document.createElement("div");

    cursorGlow.classList.add("ink-cursor");

    document.body.appendChild(cursorGlow);

    document.addEventListener("mousemove", (e) => {

        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;

    });


    // =====================================
    // 3. FLOATING INK PARTICLES
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

        particle.style.left =
            Math.random() * 100 + "vw";

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
    // 4. MANUSCRIPT REVEAL
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
    // 5. READING PROGRESS BAR
    // =====================================

    const progressBar = document.createElement("div");

    progressBar.classList.add("ink-progress");

    document.body.appendChild(progressBar);

    // Initialize both effects
    updateAbyss();

    window.addEventListener("resize", updateAbyss);


    // =====================================
    // 6. ARCHIVE ENTRY HOVER
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
    // 7. LEVIATHAN MANUSCRIPT GLOW
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
    // 8. RETURN TO THE SURFACE
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
