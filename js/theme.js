// WIP
function themeChanger() {
    let c = document.createElement("input");
    c.setAttribute('type', 'color');
    c.setAttribute('id', 'colorinput');
    document.body.appendChild(c);
    c.addEventListener('change', function() {
        // Get color from picker
        pickedColor = this.value;

        // Set accent color to picked color
        document.documentElement.style.setProperty('--accent', pickedColor);
    });
    c.click();
}