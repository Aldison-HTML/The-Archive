const header = document.querySelector('header');
let isAnimationActive = true;

// Helper: Generate a random whole number between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: Check if a book overlaps the bottom-left names area
function isInCuratorsZone(x, y, bookSize, headerHeight) {
    // Protected zone: left 480px and bottom 140px of the header
    const safeWidth = 480;
    const safeTop = headerHeight - 140;

    return x < safeWidth && (y + bookSize) > safeTop;
}

// 1. Fade out only the books on scroll (keeps h1 and curators visible)
// 1. Fade out only the books on scroll (keeps h1 and curators fully visible)
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const headerHeight = header.offsetHeight;
    const opacity = Math.max(0, 1 - (scrollPosition / headerHeight));

    header.querySelectorAll('.floating-book').forEach(el => {
        el.style.opacity = opacity;
    });
});

// 2. Delete all current books from the header
function deleteCurrentBooks() {
    const currentBooks = header.querySelectorAll('.floating-book');
    currentBooks.forEach(book => book.remove());
}

// 3. Scatter books with occasional clusters/bundles
function scatterBooks(totalBooks) {
    deleteCurrentBooks();

    const headerWidth = header.offsetWidth;
    const headerHeight = header.offsetHeight;
    const bookSize = 140;

    // Create 2 cluster anchor points outside the bottom-left corner
    const clusterCount = 2;
    const clusters = [];
    for (let c = 0; c < clusterCount; c++) {
        let cx, cy;
        do {
            cx = Math.random() * (headerWidth - bookSize * 2) + bookSize * 0.5;
            cy = Math.random() * (headerHeight - bookSize * 2) + bookSize * 0.5;
        } while (isInCuratorsZone(cx, cy, bookSize, headerHeight));

        clusters.push({ x: cx, y: cy });
    }

    for (let i = 0; i < totalBooks; i++) {
        const book = document.createElement('img');
        book.src = 'book.png';
        book.classList.add('floating-book');

        let posX, posY;
        let attempts = 0;

        // Pick coordinates and re-roll if they land in the bottom-left zone
        do {
            if (Math.random() < 0.65) {
                const cluster = clusters[Math.floor(Math.random() * clusters.length)];
                const spread = 170;
                posX = cluster.x + (Math.random() * spread - spread / 2);
                posY = cluster.y + (Math.random() * spread - spread / 2);
            } else {
                posX = Math.random() * (headerWidth - bookSize);
                posY = Math.random() * (headerHeight - bookSize);
            }

            // Keep books inside the header edges
            posX = Math.max(0, Math.min(posX, headerWidth - bookSize));
            posY = Math.max(0, Math.min(posY, headerHeight - bookSize));
            attempts++;
        } while (isInCuratorsZone(posX, posY, bookSize, headerHeight) && attempts < 25);

        const randomRotation = (Math.random() * 90) - 45;

        book.style.left = `${posX}px`;
        book.style.top = `${posY}px`;
        book.style.transform = `rotate(${randomRotation}deg)`;

        header.appendChild(book);
    }
}

const navShelf = document.querySelector('.nav-links');

if (navShelf) {
    navShelf.addEventListener('wheel', (event) => {
        if (event.deltaY !== 0) {
            event.preventDefault();
            navShelf.scrollLeft += event.deltaY;
        }
    }, { passive: false });
}


// Initial spawn on page load
if (window.scrollY <= 115) {
    scatterBooks(randomInt(25, 35));
}

// Every 1 second: delete current books and spawn a new batch if scrolled 115px or less
setInterval(() => {
    deleteCurrentBooks();
    scatterBooks(randomInt(25, 35));
}, 1000);
