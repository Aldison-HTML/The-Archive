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
    // 3. INTERACTIVE PYRE EMBERS & FIRE-TRAIL CANVAS
    // =====================================

    const canvas = document.getElementById("pyre-canvas");
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Track mouse coordinates for interactive fire reaction
    const mouse = { x: -1000, y: -1000, active: false };
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });
    window.addEventListener("mouseleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
        mouse.active = false;
    });

    const embers = [];
    const emberCount = Math.min(55, Math.floor(width / 25));

    class Ember {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 20;
            this.size = 1.5 + Math.random() * 3.5;
            this.vy = -(0.6 + Math.random() * 1.4); // Upward float speed
            this.vx = (Math.random() - 0.5) * 0.8;  // Gentle horizontal drift
            this.color = Math.random() > 0.3 ? "#ff4522" : "#ffaa33"; // Red or bright orange ember
            this.alpha = 0.2 + Math.random() * 0.6;
            this.decay = 0.002 + Math.random() * 0.004;
        }

        update() {
            // Mouse repulsion / attraction: Embers scatter or drift toward the cursor like real sparks
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 140;

            if (dist < maxDist && mouse.active) {
                const force = (maxDist - dist) / maxDist;
                this.vx += (dx / dist) * force * 0.6;
                this.vy -= force * 0.8; // Boost upward when cursor passes over
            }

            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.98; // Dampen horizontal velocity

            // Reset if out of bounds or faded out
            if (this.y < -20 || this.alpha <= 0 || this.x < -20 || this.x > width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowColor = "#ff3b1f";
            ctx.shadowBlur = 12;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < emberCount; i++) {
        embers.push(new Ember());
    }

    // Animation Loop
    function animatePyre() {
        ctx.clearRect(0, 0, width, height);

        // Draw a subtle warm glow under the cursor
        if (mouse.active) {
            const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
            cursorGlow.addColorStop(0, "rgba(255, 69, 34, 0.1)");
            cursorGlow.addColorStop(1, "transparent");
            ctx.fillStyle = cursorGlow;
            ctx.fillRect(mouse.x - 160, mouse.y - 160, 320, 320);
        }

        // Update and render all floating embers
        for (let i = 0; i < embers.length; i++) {
            embers[i].update();
            embers[i].draw();
        }

        requestAnimationFrame(animatePyre);
    }

    animatePyre();

});
