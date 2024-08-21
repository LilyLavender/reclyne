const buttonData = [
    [`#elapsed-months-button`, `bi-calendar2-check`, `bi-calendar2-check-fill`, `Show elapsed months`, `Hide elapsed months`], // hide-elapsed
    [`#autoscroll-button`, `bi-arrow-right-circle`, `bi-arrow-right-circle-fill`, `Do not automatically scroll to today`, `Automatically scroll to today`], // autoscroll-to-arrow
    [`#all-columns-button`, `bi-pen`, `bi-pen-fill`, `Edit each month's columns separately`, `Edit every month's columns at once`] // all-columns
];
const saveButton = $('#save-button');
const favicon16 = $("#favicon-16x16");
const favicon32 = $("#favicon-32x32");

// Update elapsed-months-button on click
$(buttonData[HIDE_ELAPSED][0]).on('click', function() {
    updateButton(buttonData[HIDE_ELAPSED][0], "unk", HIDE_ELAPSED, buttonData[HIDE_ELAPSED][1], buttonData[HIDE_ELAPSED][2], buttonData[HIDE_ELAPSED][3], buttonData[HIDE_ELAPSED][4]);
});

// Update autoscroll-button on click
$(buttonData[AUTOSCROLL_TO_ARROW][0]).on('click', function() {
    updateButton(buttonData[AUTOSCROLL_TO_ARROW][0], "unk", AUTOSCROLL_TO_ARROW, buttonData[AUTOSCROLL_TO_ARROW][1], buttonData[AUTOSCROLL_TO_ARROW][2], buttonData[AUTOSCROLL_TO_ARROW][3], buttonData[AUTOSCROLL_TO_ARROW][4]);
});

// Update all-columns on click
$(buttonData[ALL_COLUMNS][0]).on('click', function() {
    updateButton(buttonData[ALL_COLUMNS][0], "unk", ALL_COLUMNS, buttonData[ALL_COLUMNS][1], buttonData[ALL_COLUMNS][2], buttonData[ALL_COLUMNS][3], buttonData[ALL_COLUMNS][4]);
});

/**
 * Update nav button styling based on preferences
 */
function addClassesToNavIcons() {
    let preferences = retrieveFromLocalStorage('reclyne-preferences');
    for (i = 0; i < preferences.length; i++) {
        if (i != HIDE_ELAPSED && i != AUTOSCROLL_TO_ARROW && i != ALL_COLUMNS) continue; // todo optimize just this line
        updateButton(buttonData[i][0], preferences[i], i, buttonData[i][1], buttonData[i][2], buttonData[i][3], buttonData[i][4]);
    }
}

/**
 * Update nav button styling & localstorage
 * @param {string} selector - CSS selector for the nav button as a string. A JS object is not used so that the selector can be manipulated
 * @param {bool|string} setting - Whether to turn the button on or off
 * @param {int} prefNum - The respective number of the preference
 * @param {string} class1 - Off class for nav icon
 * @param {string} class2 - On class for nav icon
 * @param {string} onTitle - Tooltip text for when button is on
 * @param {string} offTitle - Tooltip text for when button is off
 */
function updateButton(selector, setting, prefNum, class1, class2, onTitle, offTitle) {
    // Declare element vars
    var element = $(selector);
    var elementTooltip = $(`${selector} .tooltiptext`);

    // Update styling
    if (setting == "unk") {
        setting = false;
        if (element.hasClass(class1)) setting = true;
    }
    if (setting) {
        element.addClass(class2);
        element.removeClass(class1);
        element.addClass('btn-light');
        elementTooltip.html(onTitle);
    } else {
        element.addClass(class1);
        element.removeClass(class2);
        element.removeClass('btn-light');
        elementTooltip.html(offTitle);
    }

    // Update storage
    updateStorageForPreference(prefNum, setting);
}

// Update save button styles when typing
// Uses event delegation on the document because table content is added during runtime
// Event delegation is the best option here because adding a seperate event handler to every input element lags substantially
doc.on('input', `table tr > td > input[type='text']`, function() {
    updateSaveButtonUnsaved();
})

/**
 * Update save button styling for when data is saved
 */
function updateSaveButtonSaved() {
    window.removeEventListener("beforeunload", beforeUnload);
    saveButton.removeClass("btn-active");
    favicon16.attr("href", "./favicon/favicon-16x16.png");
    favicon32.attr("href", "./favicon/favicon-32x32.png");
    doc.prop('title', 'reclyne');
}

/**
 * Update save button styling for when data is unsaved
 */
function updateSaveButtonUnsaved() {
    window.addEventListener("beforeunload", beforeUnload);
    saveButton.addClass('btn-active');
    favicon16.attr("href", "./favicon/favicon-16x16-red.png");
    favicon32.attr("href", "./favicon/favicon-32x32-red.png");
    doc.prop('title', 'reclyne - Unsaved Changes');
}