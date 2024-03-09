
$('#elapsedMonthsButton').on('click', function() {
    updateButton($(this), "unk", HIDE_ELAPSED, buttonData[HIDE_ELAPSED][1], buttonData[HIDE_ELAPSED][2], buttonData[HIDE_ELAPSED][3], buttonData[HIDE_ELAPSED][4]);
});

$('#autoscrollButton').on('click', function() {
    updateButton($(this), "unk", AUTOSCROLL_TO_ARROW, buttonData[AUTOSCROLL_TO_ARROW][1], buttonData[AUTOSCROLL_TO_ARROW][2], buttonData[AUTOSCROLL_TO_ARROW][3], buttonData[AUTOSCROLL_TO_ARROW][4]);
});

function addClassesToNavIcons() {
    let preferences = retrieveFromLocalStorage('reclyne-preferences');
    for (i = 0; i < preferences.length; i++) {
        if (i == 2) continue;
        updateButton($(buttonData[i][0]), preferences[i], i, buttonData[i][1], buttonData[i][2], buttonData[i][3], buttonData[i][4]);
    }
}

function updateButton(element, setting, prefNum, class1, class2, onTitle, offTitle) {
    // Update styling
    if (setting == "unk") {
        setting = false;
    if (element.hasClass(class1)) setting = true
    }
    if (setting) {
        element.addClass(class2);
        element.removeClass(class1);
        element.addClass('btn-light');
        element.prop('title', onTitle);
    } else {
        element.addClass(class1);
        element.removeClass(class2);
        element.removeClass('btn-light');
        element.prop('title', offTitle);
    }

    // Update storage
    updateStorageForPreference(prefNum, setting);
}

// Update save button styles when typing
$(document).on('input', `table input[type='text']`, function() {
    $('#saveButton').addClass('btn-active');
})