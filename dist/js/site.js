var cards = document.querySelectorAll(".mc-color-card");

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
