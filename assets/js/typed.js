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
    
    // Multi-language glitch effect for main title
    const mainTitle = document.getElementById('main-title');
    if (mainTitle) {
        const languages = [
            { text: 'Hello <br>Everyone', needsBr: false },           // English
            { text: '大家好 <br><br>', needsBr: false },                    // Mandarin
            { text: 'こんにちは <br>みなさん', needsBr: true },    // Japanese
            { text: '안녕하세요 <br>여러분', needsBr: true },      // Korean
            { text: 'Hola a <br>Todos', needsBr: false },            // Spanish
            { text: 'Привет <br>Всем', needsBr: false },             // Russian
            { text: 'مرحبا<br> بالجميع', needsBr: true },        // Arabic
            { text: 'Ciao a <br>Tutti', needsBr: false },            // Italian
            { text: 'Bonjour à <br>Tous', needsBr: true },        // French
            { text: 'Hallo <br>Zusammen', needsBr: true }         // German
        ];
        
        let currentIndex = 0;
        
        const changeLanguage = () => {
            mainTitle.classList.add('is-glitching');
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % languages.length;
                const current = languages[currentIndex];
                
                mainTitle.innerHTML = current.text;
                mainTitle.setAttribute('data-text', current.text.replace('<br>', ' '));
                
                mainTitle.classList.remove('is-glitching');
            }, 180); // Half of glitch animation
        };
        
        // Change language every 3 seconds with glitch effect
        setInterval(changeLanguage, 3000);
    }
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