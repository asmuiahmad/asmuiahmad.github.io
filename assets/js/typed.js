document.addEventListener("DOMContentLoaded", function() {
    new Typed('.hero-typed', {
        strings: [" ","I'm Ahmad Asmu'i.","I'm Web-Designer.","I'm ML Engineer.", 
                  "I'm Dreamer.", "I'm Traveler.", "I'm Future Data Scientist."],
        typeSpeed: 50,
        backSpeed: 30,
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
