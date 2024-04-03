const root = $(':root');
// Dark, light, accent
var allColors = ["#110b1d", "#d5d9f2", "#9da8ec"];

// WIP
function themeChanger() {
    let c = document.createElement("input");
    c.setAttribute('type', 'color');
    c.setAttribute('id', 'colorinput');
    document.body.appendChild(c);
    c.addEventListener('change', function() {
        // Get color from picker
        pickedColor = this.value;

        // Calculate light and dark colors from accent (DEBUG ONLY, TODO)
        allColors[0] = $.xcolor.opacity(pickedColor, '#101010', 0.90);
        allColors[1] = $.xcolor.opacity(pickedColor, '#F0F0F0', 0.90);

        // Set colors
        allColors[2] = pickedColor;
        calculateColors();
    });
    c.click();
}

// Calculate colors and set them in :root
function calculateColors() {
    // Get dark, light, and accent colors
    var colorDark = allColors[0];
    var colorLight = allColors[1];
    var colorAccent = allColors[2];

    // Set dark, light, and accent colors
    root.css('--dark', colorDark);
    root.css('--light', colorLight);
    root.css('--accent', colorAccent);

    // Get middle colors between light and accent
    var colorAccent50 = $.xcolor.average(colorLight, colorAccent).getRGB(); // xcolor.average returns an xcolor object, but cannot take one
    var colorAccent25 = $.xcolor.average(colorAccent50, colorLight);
    var colorAccent75 = $.xcolor.average(colorAccent50, colorAccent);

    // Set middle colors
    root.css('--accent-25', colorAccent25);
    root.css('--accent-50', colorAccent50);
    root.css('--accent-75', colorAccent75);
}