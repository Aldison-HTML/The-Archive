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

});
