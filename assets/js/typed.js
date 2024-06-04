document.addEventListener("DOMContentLoaded", function() {
    new Typed('.hero-typed', {
        strings: ["I'm Ahmad Asmu'i.","I'm Web-Designer.","I'm ML Engineer.", "I'm Dreamer.", "I'm Traveler.", "I'm Lover.", "I'm Future Scientist."],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true
    });
});

function updateTitle() {
    // Get the current title
    var currentTitle = document.title;
    // Rotate the title by shifting the first character to the end
    var newTitle = currentTitle.substring(1) + currentTitle.charAt(0);
    // Add a space after each character
    newTitle = newTitle.split('').join(' ');
    // Set the new title
    document.title = newTitle;
}

setInterval(updateTitle, 100);