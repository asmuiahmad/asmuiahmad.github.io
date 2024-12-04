document.addEventListener("DOMContentLoaded", function() {
    new Typed('.hero-typed', {
        strings: ["","I'm Ahmad Asmu'i.","I'm a Web-Designer.","I'm a ML Engineer.",
                  "I'm a Dreamer.", "I'm a Traveler.", "I'm a Lover."],
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