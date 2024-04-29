const root = $(':root');

/**
 * Old themeChanger from [a1.0.8]. Exists only to make finishing the themeChanger faster
 * @deprecated
 * @todo
 */
function themeChanger() {
    let c = document.createElement("input");
    c.setAttribute('type', 'color');
    c.setAttribute('id', 'colorinput');
    document.body.appendChild(c);
    c.addEventListener('change', function() {
        // Get color from picker
        pickedColor = this.value;
        console.log(pickedColor);
    });
    c.click();
}

/**
 * Creates theme data, calculates middle colors for the current theme, and sets colors on the page
 * @param {*} themeNumber - The current theme number from reclyne-preferences, not to be confused with reclyne-theme
 */
function initializeTheme(themeNumber) {
    // Get theme data from localstorage
    let themePreferences = retrieveFromLocalStorage('reclyne-theme');
    if (themePreferences == null) {
        // Create theme data if doesn't exist
        console.log(`Theme data doesn't exist! Creating...`);
        updateLocalStorage('reclyne-theme', defaultThemeColors);
        console.log(`Created theme data!`);
        // Get theme data from localstorage, now that it exists
        themePreferences = retrieveFromLocalStorage('reclyne-theme');
    }
    // If current theme doesn't have middle colors, create them
    if (themePreferences[themeNumber][4] == null) {
        calculateAndSetMiddleColors(themeNumber);
    }
    // Set colors on the page
    setPageColors(themeNumber);
}

/**
 * Calculates and sets colors in-bewteen light and accent colors
 * @param {int} themeNumber - The current theme number from reclyne-preferences
 */
function calculateAndSetMiddleColors(themeNumber) {
    // Get color preferences
    let allColors = retrieveFromLocalStorage('reclyne-theme');

    // Get dark, light, and accent colors
    var colorLight = allColors[themeNumber][2];
    var colorAccent = allColors[themeNumber][3];

    // Get middle colors between light and accent
    var colorAccent50 = String($.xcolor.average(colorLight, colorAccent));
    var colorAccent25 = String($.xcolor.average(colorAccent50, colorLight));
    var colorAccent75 = String($.xcolor.average(colorAccent50, colorAccent));

    // Set middle colors in localstorage
    allColors[themeNumber][4] = colorAccent25;
    allColors[themeNumber][5] = colorAccent50;
    allColors[themeNumber][6] = colorAccent75;
    updateLocalStorage('reclyne-theme', allColors);
}

/**
 * Sets all colors for the current theme to the :root selector
 * @param {int} themeNumber - The current theme number from reclyne-preferences
 */
function setPageColors(themeNumber) {
    // Get color preferences
    let allColors = retrieveFromLocalStorage('reclyne-theme');

    // Set colors on page
    root.css({
        '--dark' : allColors[themeNumber][1],
        '--light' : allColors[themeNumber][2],
        '--accent' : allColors[themeNumber][3],
        '--accent-25' : allColors[themeNumber][4],
        '--accent-50' : allColors[themeNumber][5],
        '--accent-75' : allColors[themeNumber][6]
    });
}

/**
 * DEBUG - Sets the theme number to the number passed in
 */
function setThemeNumber(num) {
    updateStorageForPreference(THEME_NUMBER, num);
}

/**
 * DEBUG - Removes reclyne-theme from localstorage
 */
function removeThemeData() {
    removeFromLocalStorage('reclyne-theme');
}