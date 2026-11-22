
document.addEventListener("DOMContentLoaded", () => {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // READING PROGRESS BAR

    const progressBar = document.querySelector(".reading-progress");

    function updateProgress() {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", updateProgress);
    updateProgress();


    // SCROLL REVEAL ANIMATION

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reducedMotion) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

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

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    // ACTIVE ARCHIVE VOLUME

    const archiveEntries = document.querySelectorAll(".archive-entry");

    const volumes = [
        document.querySelector("#vol1"),
        document.querySelector("#vol2"),
        document.querySelector("#vol3")
    ];

    function setActiveVolume(index) {

        archiveEntries.forEach((entry, i) => {
            entry.classList.toggle("active", i === index);
        });

    }

    if ("IntersectionObserver" in window) {

        const volumeObserver = new IntersectionObserver(
            entries => {

                const visibleVolumes = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visibleVolumes.length > 0) {

                    const activeIndex = volumes.indexOf(
                        visibleVolumes[0].target
                    );

                    if (activeIndex !== -1) {
                        setActiveVolume(activeIndex);
                    }

                }

            },
            {
                rootMargin: "-20% 0px -55% 0px",
                threshold: [0, 0.1, 0.25, 0.5]
            }
        );

        volumes.forEach(volume => {
            if (volume) {
                volumeObserver.observe(volume);
            }
        });

    }


    // ARCHIVE INDEX CLICK

    archiveEntries.forEach((entry, index) => {

        entry.addEventListener("click", () => {
            setActiveVolume(index);
        });

    });


    // FLOATING ASH PARTICLES

    if (!reducedMotion) {

        const particleSymbols = ["✧", "·", "✦", "˚", "⋆"];

        function createParticle() {

            const particle = document.createElement("span");

            particle.classList.add("ash-particle");

            particle.textContent =
                particleSymbols[
                    Math.floor(Math.random() * particleSymbols.length)
                ];

            const size = Math.random() * 10 + 7;
            const duration = Math.random() * 12 + 10;

            particle.style.position = "fixed";
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.bottom = "-20px";
            particle.style.fontSize = `${size}px`;
            particle.style.color = "#b5a2c0";
            particle.style.opacity = "0";
            particle.style.pointerEvents = "none";
            particle.style.zIndex = "0";
            particle.style.textShadow =
                "0 0 12px rgba(180, 150, 200, 0.7)";

            particle.style.transition =
                `transform ${duration}s linear, opacity 2s ease`;

            document.body.appendChild(particle);

            requestAnimationFrame(() => {

                particle.style.opacity =
                    (Math.random() * 0.35 + 0.1).toString();

                particle.style.transform =
                    `translateY(-${window.innerHeight + 100}px) translateX(${Math.random() * 100 - 50}px)`;

            });

            setTimeout(() => {
                particle.remove();
            }, duration * 1000 + 2500);

        }

        setInterval(createParticle, 1400);

    }


    // CURSOR GLOW

    if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {

        const cursorGlow = document.createElement("div");

        cursorGlow.classList.add("cursor-glow");

        cursorGlow.style.position = "fixed";
        cursorGlow.style.width = "220px";
        cursorGlow.style.height = "220px";
        cursorGlow.style.borderRadius = "50%";
        cursorGlow.style.pointerEvents = "none";
        cursorGlow.style.zIndex = "0";
        cursorGlow.style.transform = "translate(-50%, -50%)";
        cursorGlow.style.background =
            "radial-gradient(circle, rgba(120, 91, 140, 0.09), transparent 70%)";

        document.body.appendChild(cursorGlow);

        window.addEventListener("mousemove", event => {

            cursorGlow.style.left = `${event.clientX}px`;
            cursorGlow.style.top = `${event.clientY}px`;

        });

    }

});
