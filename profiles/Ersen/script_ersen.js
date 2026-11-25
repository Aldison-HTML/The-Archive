document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. SCROLL REVEAL
    // =====================================

    const revealElements = document.querySelectorAll(
        ".story, .document-group, .archive-entry, .closing-note, .codex-progress-box"
    );

    revealElements.forEach(element => element.classList.add("reveal"));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(element => revealObserver.observe(element));


    // =====================================
    // 2. READING PROGRESS BAR
    // =====================================

    const progressBar = document.createElement("div");
    progressBar.classList.add("reading-progress");
    document.body.appendChild(progressBar);

    function updateProgress() {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = progress + "%";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();


    // =====================================
    // 3. 3D INTERACTIVE TILT ON ARCHIVE CARDS
    // =====================================

    const tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Subtle 3D tilt angle
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(8px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) translateX(0px)`;
        });
    });


    // =====================================
    // 4. INTERACTIVE PYRE EMBERS & CLICK SHOCKWAVE
    // =====================================

    const canvas = document.getElementById("pyre-canvas");
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const mouse = { x: -1000, y: -1000, active: false };
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
        mouse.active = false;
    });

    // Performance-capped ember array
    const embers = [];
    const emberCount = Math.min(45, Math.floor(width / 30));

    class Ember {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 20;
            this.size = 1.5 + Math.random() * 3;
            this.vy = -(0.6 + Math.random() * 1.3);
            this.vx = (Math.random() - 0.5) * 0.6;
            this.color = Math.random() > 0.35 ? "#ff4522" : "#ff9933";
            this.alpha = 0.25 + Math.random() * 0.6;
        }

        update() {
            if (mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                const maxDistSq = 19600; // 140px radius squared (faster math, zero lag)

                if (distSq < maxDistSq && distSq > 1) {
                    const dist = Math.sqrt(distSq);
                    const force = (140 - dist) / 140;
                    this.vx += (dx / dist) * force * 0.5;
                    this.vy -= force * 0.7;
                }
            }

            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.97;

            if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }

    for (let i = 0; i < emberCount; i++) {
        embers.push(new Ember());
    }

    // Fiery Shockwave Rings on Click
    const shockwaves = [];

    window.addEventListener("click", (e) => {
        if (shockwaves.length < 4) { // Cap active shockwaves to prevent lag
            shockwaves.push({
                x: e.clientX,
                y: e.clientY,
                radius: 4,
                maxRadius: 110,
                alpha: 0.75
            });
        }
    });

    function animatePyre() {
        ctx.clearRect(0, 0, width, height);

        // Subtle warm fire aura following cursor
        if (mouse.active) {
            const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
            cursorGlow.addColorStop(0, "rgba(255, 69, 34, 0.12)");
            cursorGlow.addColorStop(1, "transparent");
            ctx.globalAlpha = 1;
            ctx.fillStyle = cursorGlow;
            ctx.fillRect(mouse.x - 150, mouse.y - 150, 300, 300);
        }

        // Draw Embers
        ctx.shadowColor = "#ff3b1f";
        ctx.shadowBlur = 8;
        for (let i = 0; i < embers.length; i++) {
            embers[i].update();
            embers[i].draw();
        }
        ctx.shadowBlur = 0;

        // Draw Click Shockwave Rings
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            sw.radius += 3.5;
            sw.alpha -= 0.025;

            if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
                shockwaves.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 110, 60, ${sw.alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        requestAnimationFrame(animatePyre);
    }

    animatePyre();

});
