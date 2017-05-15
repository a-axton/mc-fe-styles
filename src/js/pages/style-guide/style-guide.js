var cards          = document.querySelectorAll(".mc-color-card"),
    navLinks       = document.querySelectorAll('#sidebar a'),
    navActiveClass = "active";

function removeNavClasses() {
    Array.prototype.forEach.call(navLinks, function(el, i){
        // Remove all "active" classes
        if (el.classList)
          el.classList.remove(navActiveClass);
        else
          el.className = el.className.replace(new RegExp('(^|\\b)' + navActiveClass.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    });
}

// Logic for getting/setting hex values on the color cards
Array.prototype.forEach.call(cards, function(el, i){
    // Get the hex value from data attribute
    var hexValue  = el.getAttribute('data-color'),
        hexSwatch = el.querySelectorAll(".mc-color-swatch")[0],
        hexTextEl = el.querySelectorAll(".mc-color-value")[0];

    // Replace the card hex value
    hexTextEl.innerHTML = hexValue;

    // Inline style the hex value for the swatch
    hexSwatch.style.background = hexValue;
});

// Active classes / scrolling logic for navigation
Array.prototype.forEach.call(navLinks, function(el, i){
    el.addEventListener("click", function() {
        removeNavClasses();

        // Add active class
        if (el.classList)
          el.classList.add(navActiveClass);
        else
          el.className += ' ' + navActiveClass;
    });
});