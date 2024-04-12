const root = $(':root');

// WIP, depreciated, todo
function themeChanger(colorType) {
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

function initializeTheme(themeNumber) {
    let themePreferences = retrieveFromLocalStorage('reclyne-theme');
    if (themePreferences == null) {
        // Create theme data if doesn't exist
        updateLocalStorage('reclyne-theme', defaultThemeColors);
        // Get theme data from localStorage, now that it exists
        themePreferences = retrieveFromLocalStorage('reclyne-theme');
    }
    if (themePreferences[themeNumber][4] == null) {
        calculateAndSetMiddleColors(themeNumber);
    }
    setPageColors(themeNumber);
}

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

// debug
function setThemeNumber(num) {
    updateStorageForPreference(THEME_NUMBER, num);
}

// debug
function removeThemeData() {
    removeFromLocalStorage('reclyne-theme');
}