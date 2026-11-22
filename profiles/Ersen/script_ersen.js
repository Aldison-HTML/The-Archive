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

    window.addEventListener("scroll", updateProgress);
    updateProgress();


    // =====================================
    // 3. INTERACTIVE MAGIC CANVAS (60 FPS, ZERO LAG)
    // =====================================

    const canvas = document.getElementById("arcane-canvas");
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Track mouse position for interactive magic field
    const mouse = { x: -1000, y: -1000 };
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    const runes = [
        "ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", 
        "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛇ", "ᛈ", "ᛉ", "ᛊ", 
        "ᛏ", "ᛒ", "ᛖ", "ᛗ", "ᛚ", "ᛜ", "ᛞ", "ᛟ"
    ];

    // Background floating enchantment runes
    const ambientParticles = [];
    const particleCount = Math.min(45, Math.floor(width / 30)); // Responsive count

    class AmbientRune {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 30;
            this.vy = -(0.3 + Math.random() * 0.7); // Float upward
            this.vx = (Math.random() - 0.5) * 0.3;
            this.size = 11 + Math.random() * 10;
            this.glyph = runes[Math.floor(Math.random() * runes.length)];
            this.alpha = 0.15 + Math.random() * 0.45;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.015;
        }

        update() {
            // Interactive magnetic swirl & glow near cursor
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 160;

            if (dist < maxDist) {
                const force = (maxDist - dist) / maxDist;
                // Gentle swirling push around cursor
                this.x += (dx / dist) * force * 2.2 - (dy / dist) * force * 1.2;
                this.y += (dy / dist) * force * 2.2 + (dx / dist) * force * 1.2;
                this.currentAlpha = Math.min(1, this.alpha + force * 0.7);
            } else {
                this.currentAlpha = this.alpha;
            }

            this.x += this.vx;
            this.y += this.vy;
            this.angle += this.spin;

            if (this.y < -30 || this.x < -30 || this.x > width + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.font = `${this.size}px serif`;
            ctx.fillStyle = `rgba(243, 210, 102, ${this.currentAlpha})`;
            ctx.shadowColor = "rgba(212, 175, 55, 0.8)";
            ctx.shadowBlur = 8;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.glyph, 0, 0);
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        ambientParticles.push(new AmbientRune());
    }

    // =====================================
    // 4. 360° RADIAL CLICK EXPLOSION PARTICLES
    // =====================================

    const burstParticles = [];
    const burstSymbols = ["✦", "✧", "⚝", "★", "·"];

    class BurstSparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // True 360-degree random scatter
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 5.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.friction = 0.94; // Slows down smoothly like real sparks
            this.gravity = 0.04;  // Slight magical drift
            this.alpha = 1;
            this.decay = 0.018 + Math.random() * 0.02;
            this.size = 10 + Math.random() * 10;
            this.glyph = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
            this.rotation = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.15;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.spin;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.font = `${this.size}px serif`;
            ctx.fillStyle = `rgba(255, 232, 133, ${Math.max(0, this.alpha)})`;
            ctx.shadowColor = "rgba(243, 210, 102, 0.9)";
            ctx.shadowBlur = 10;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.glyph, 0, 0);
            ctx.restore();
        }
    }

    // Trigger 360° radial burst on click
    window.addEventListener("click", (e) => {
        for (let i = 0; i < 16; i++) {
            burstParticles.push(new BurstSparkle(e.clientX, e.clientY));
        }
    });

    // Main Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw subtle golden aura around cursor
        if (mouse.x > 0 && mouse.y > 0) {
            const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
            gradient.addColorStop(0, "rgba(243, 210, 102, 0.12)");
            gradient.addColorStop(0.5, "rgba(212, 175, 55, 0.03)");
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fillRect(mouse.x - 180, mouse.y - 180, 360, 360);
        }

        // Update & draw floating runes + golden constellation threads near cursor
        for (let i = 0; i < ambientParticles.length; i++) {
            const p = ambientParticles[i];
            p.update();
            p.draw();

            // Connect nearby runes to cursor with faint golden magic lines
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 140) * 0.25})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        // Update & draw click explosion sparkles
        for (let i = burstParticles.length - 1; i >= 0; i--) {
            const b = burstParticles[i];
            b.update();
            b.draw();
            if (b.alpha <= 0) {
                burstParticles.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

});
