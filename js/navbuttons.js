const buttonData = [
    ['#elapsedMonthsButton', 'bi-calendar2-check', 'bi-calendar2-check-fill', 'Show elapsed months', 'Hide elapsed months'], // hide-elapsed
    ['#autoscrollButton', 'bi-arrow-right-circle', 'bi-arrow-right-circle-fill', 'Do not automatically scroll to today', 'Automatically scroll to today'] // autoscroll-to-arrow
];
const saveButton = $('#saveButton');
const favicon16 = $("#favicon-16x16");
const favicon32 = $("#favicon-32x32");

$('#elapsedMonthsButton').on('click', function() {
    updateButton('#elapsedMonthsButton', "unk", HIDE_ELAPSED, buttonData[HIDE_ELAPSED][1], buttonData[HIDE_ELAPSED][2], buttonData[HIDE_ELAPSED][3], buttonData[HIDE_ELAPSED][4]);
});

$('#autoscrollButton').on('click', function() {
    updateButton('#autoscrollButton', "unk", AUTOSCROLL_TO_ARROW, buttonData[AUTOSCROLL_TO_ARROW][1], buttonData[AUTOSCROLL_TO_ARROW][2], buttonData[AUTOSCROLL_TO_ARROW][3], buttonData[AUTOSCROLL_TO_ARROW][4]);
});

function addClassesToNavIcons() {
    let preferences = retrieveFromLocalStorage('reclyne-preferences');
    for (i = 0; i < preferences.length; i++) {
        if (i == 2 || i == 3) continue;
        updateButton(buttonData[i][0], preferences[i], i, buttonData[i][1], buttonData[i][2], buttonData[i][3], buttonData[i][4]);
    }
}

function updateButton(selector, setting, prefNum, class1, class2, onTitle, offTitle) {
    // Declare element vars
    var element = $(selector);
    var elementTooltip = $(`${selector} .tooltiptext`);

    // Update styling
    if (setting == "unk") {
        setting = false;
    if (element.hasClass(class1)) setting = true
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
doc.on('input', `table input[type='text']`, function() {
    updateSaveButtonUnsaved();
})

function updateSaveButtonSaved() {
    saveButton.removeClass("btn-active");
    favicon16.attr("href", "./favicon/favicon-16x16.png");
    favicon32.attr("href", "./favicon/favicon-32x32.png");
    doc.prop('title', 'reclyne');
}

function updateSaveButtonUnsaved() {
    saveButton.addClass('btn-active');
    favicon16.attr("href", "./favicon/favicon-16x16-red.png");
    favicon32.attr("href", "./favicon/favicon-32x32-red.png");
    doc.prop('title', 'reclyne - Unsaved Changes');
}