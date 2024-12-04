document.addEventListener("DOMContentLoaded", function() {
    new Typed('.hero-typed', {
        strings: ["","I'm Ahmad Asmu'i.","I'm Web-Designer.","I'm ML Engineer.",
                  "I'm Dreamer.", "I'm Traveler.", "I'm Lover.", "I'm Future Data Scientist."],
        typeSpeed: 75,
        backSpeed: 20,
        loop: true
    });
});

function updateTitle() {
    var currentTitle = document.title;
    var newTitle = currentTitle.substring(1) + currentTitle.charAt(0);
    newTitle = newTitle.split('').join(' ');
    document.title = newTitle;
}

setInterval(updateTitle, 100);