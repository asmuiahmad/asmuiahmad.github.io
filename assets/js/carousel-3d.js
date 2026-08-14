// 3D Carousel for Life Section
const init3DCarousel = () => {
    const carousel = document.querySelector('.carousel-3d');
    const prevBtn = document.querySelector('.prev-3d');
    const nextBtn = document.querySelector('.next-3d');
    const indicatorsContainer = document.querySelector('.indicators-3d');
    
    if (!carousel || !prevBtn || !nextBtn || !indicatorsContainer) return;

    // Card data for Life section
    const cardData = [
        {
            img: 'assets/img/life-img/machine.png',
            title: 'Machine',
            desc: 'Crafting wonders, day and night. Blueprints glow with mystic light. Building worlds from thought and air.',
            btnText: 'Explore',
            link: '#0'
        },
        {
            img: 'assets/img/life-img/symphony.png',
            title: 'Symphony',
            desc: 'Flowers sway in the meadow\'s light. A sound that dances through day and night. Beautiful eyes reflect the skies.',
            btnText: 'Discover',
            link: '#0'
        },
        {
            img: 'assets/img/life-img/fantasy.png',
            title: 'Fantasy',
            desc: 'In realms where dragons soar and magic whispers. Dreams unfold like ancient scrolls. Mystic lands where legends dwell.',
            btnText: 'Dream',
            link: '#0'
        }
    ];

    let currentIndex = 0;
    let cards = [];
    let indicators = [];

    // Create cards
    function createCards() {
        cardData.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = 'card-3d';
            card.innerHTML = `
                <img src="${data.img}" alt="${data.title}" class="card-3d-img">
                <h3 class="card-3d-title">${data.title}</h3>
                <p class="card-3d-desc">${data.desc}</p>
                <a href="${data.link}" class="card-3d-btn">${data.btnText}</a>
            `;
            carousel.appendChild(card);
            cards.push(card);

            // Create indicators
            const indicator = document.createElement('div');
            indicator.className = 'indicator-3d';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToCard(index));
            indicatorsContainer.appendChild(indicator);
            indicators.push(indicator);
        });
        updateCarousel();
    }

    // Update carousel position
    function updateCarousel() {
        const angle = 360 / cards.length;
        const radius = Math.min(400, window.innerWidth / 2.5);

        cards.forEach((card, i) => {
            const rotation = angle * (i - currentIndex);
            const z = radius * Math.cos(rotation * Math.PI / 180);
            const x = radius * Math.sin(rotation * Math.PI / 180);

            // Highlight the front card
            if (i === currentIndex) {
                card.style.opacity = '1';
                card.style.transform = `translate(-50%, -50%) translateZ(30px)`;
                card.style.zIndex = '10';
                card.style.filter = 'none';
                card.style.pointerEvents = 'auto';
            } else {
                const distance = Math.min(5, Math.abs(i - currentIndex));
                card.style.opacity = `${Math.max(0.3, 1 - distance * 0.3)}`;
                card.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotation}deg)`;
                card.style.zIndex = `${10 - distance}`;
                card.style.filter = `blur(${distance * 2}px)`;
                card.style.pointerEvents = 'none';
            }
        });

        // Update indicators
        indicators.forEach((indicator, i) => {
            if (i === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Navigate to specific card
    function goToCard(index) {
        currentIndex = index;
        updateCarousel();
    }

    // Next card
    function nextCard() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    }

    // Previous card
    function prevCard() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    }

    // Event listeners
    nextBtn.addEventListener('click', nextCard);
    prevBtn.addEventListener('click', prevCard);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextCard();
        if (e.key === 'ArrowLeft') prevCard();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextCard();
        if (touchEndX > touchStartX + 50) prevCard();
    }

    // Resize handler
    window.addEventListener('resize', updateCarousel);

    // Initialize
    createCards();
};

// Initialize carousel after loading is complete
if (document.body.classList.contains('crt-complete')) {
    init3DCarousel();
} else {
    window.addEventListener('loadingComplete', init3DCarousel, { once: true });
}
