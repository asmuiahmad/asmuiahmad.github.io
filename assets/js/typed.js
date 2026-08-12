// Wait for loading screen and CRT effect to complete before starting animations
const startMainPageAnimations = () => {
    // Initialize typing animation
    new Typed('.hero-typed', {
        strings: ["","I'm Ahmad Asmu'i.","I'm a Web-Designer.","I'm a ML Engineer.",
                  "I'm a Dreamer.", "I'm a Traveler.", "I'm a Lover."],
        typeSpeed: 75,
        backSpeed: 20,
        loop: true
    });
    
    // Start title animation
    setInterval(updateTitle, 100);
};

// Only start animations after loading is complete
if (document.body.classList.contains('crt-complete')) {
    // Loading already complete, start immediately
    document.addEventListener("DOMContentLoaded", startMainPageAnimations);
} else {
    // Wait for loading complete event
    window.addEventListener('loadingComplete', startMainPageAnimations, { once: true });
}

function updateTitle() {
    var currentTitle = document.title;
    var newTitle = currentTitle.substring(1) + currentTitle.charAt(0);
    newTitle = newTitle.split('').join(' ');
    document.title = newTitle;
}