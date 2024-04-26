const gotobox = $('#gotobox');
const gotosyntaxbox = $('#gotosyntaxbox');
const gotoinput = $('#gotoinput');
const gotopreview = $('#gotopreview');
const gotopreviewhelper = $('#gotopreviewhelper');
const dateFormatArrow = $('#dateFormatArrow');
const dateFormatLeft = $('p:has(+ #dateFormatArrow)');
const dateFormatRight = $('#dateFormatArrow + p');

/**
 * Shows the export box. 
 * <br>Also puts the cursor in gotoinput so the user can start typing right away
 */
function showGotobox() {
    // Clear all other boxes
    hideAllBoxes();
    // Visually show box
    gotobox.removeClass('hiddenTrans');
    // Show overlay
    overlay.removeClass('hidden');
    // Put cursor in text box
    gotoinput.focus();
}

/**
 * Hides the export box.
 * <br>Also clears input & preview boxes, and hides syntax box as well
 */
function hideGotobox() {
    // Visually hide box
    gotobox.addClass('hiddenTrans');
    // Hide syntax box
    hideSyntaxBox();
    // Hide overlay
    overlay.addClass('hidden');
    // Unfocus input box
    gotoinput.blur();
    // Clear input
    gotoinput.val('');
    // Clear preview box
    gotopreviewhelper
        .html("Preview will show up here")
        .addClass('inactive');
    gotopreview.html("");
}

/**
 * Hides goto syntax box
 */
function hideSyntaxBox() {
    gotosyntaxbox.addClass('hiddenTrans');
}

/**
 * Shows goto syntax box
 */
function showSyntaxBox() {
    gotosyntaxbox.removeClass('hiddenTrans');
}

// Scrolls to the correct date when gotoform is submitted. Doesn't scroll if date isn't valid
$('#gotoform').on('submit', function(e) {
    e.preventDefault();
    // Get date to scroll to
    let gotoDate = getGotoDate();
    // If date is valid
    if (!!gotoDate[0]) {
        // Scroll to date
        scrollToDate(gotoDate, scrollToDateDelay);
        // Hide gotobox
        hideGotobox();
    }
});

/**
 * Update date preview when typing in gotoinput
 */
gotoinput.on('input', function() {
    showDatePreview();
});

// Update date preview when switching the date locale
$('#gotoline3').on('click', function() {
    showDatePreview();
});

/**
 * Shows the preview of the date the user is going to in gotopreviewhelper & gotopreview
 */
function showDatePreview() {
    let gotoDate = getGotoDate();
    if (!gotoDate[0]) {
        // Date in preview box invalid
        gotopreviewhelper
            .html("Preview will show up here")
            .addClass('inactive');
        gotopreview.html("");
    } else {
        // Date in preview box valid
        gotopreviewhelper
            .html("Going to:")
            .removeClass('inactive');
        gotopreview.html(getPrettyDate(gotoDate[0], gotoDate[1], gotoDate[2]));
    }
}

/**
 * Checks if a date exists
 * @param {Date} date - The day/month combo to check. Year is ignored
 * @param {string} year - The year to check
 * @returns True for a valid date (eg 12/15/2024) and false for an invalid date (eg 02/29/2023, 06/31/2024)
 */
function dateIsExist(date, year) {
    let formattedDate = date.toLowerCase().replace(" 0", " ");
    let dateObj = new Date(`${year} ${date}`);
    let formattedDateObj = `${monthsShort[dateObj.getMonth()]} ${dateObj.getDate()}`;

    if (formattedDate == formattedDateObj) {
        return true;
    }
    return false;
}

/**
 * Formats a date in Fullname Xth, yyyy
 * @param {Date} date - Date object to format
 * @param {bool} isMonth - Whether or not to include the month. If false, just returns the year as a string
 * @param {bool} isDay - Whether or not to include the day. If false, returns a format such as "January 2024"
 * @returns string of the date object in Fullname Xth, yyyy (eg August 3rd, 2022)
 */
function getPrettyDate(date, isMonth, isDay) {
    var daySuffixes = ["st", "nd", "rd", "th"];
    var day = date.getDate();
    var daySuffixes;
    if (day >= 11 && day <= 13) {
        daySuffixes = "th";
    } else {
        daySuffixes = daySuffixes[(day - 1) % 10] || "th";
    }
    let ret = "";
    if (isMonth) ret += monthsLongUpper[date.getMonth()] + " ";
    if (isDay) ret += day + daySuffixes + ", ";
    ret += date.getFullYear();
    return ret;
}

// Changes date locale to month first when clicked 
// todo figure out if you can just check for the current pref instead of the class
dateFormatRight.on('click', function() {
    if (!dateFormatArrow.hasClass('rotate90right')) {
        dateFormatAddClasses(true);
    }
});

// Changes date locale to day first when clicked
dateFormatLeft.on('click', function() {
    if (!dateFormatArrow.hasClass('rotate90left')) {
        dateFormatAddClasses(false);
    }
});

// Toggles date locale when the arrow is clicked
dateFormatArrow.on('click', function() {
    if (dateFormatArrow.hasClass('rotate90left')) {
        dateFormatAddClasses(true);
    } else {
        dateFormatAddClasses(false);
    }
});

/**
 * Controls CSS of the locale switcher
 * <br>Also updates localstorage for the preference
 * @param {bool} right - If the arrow should point right (false is left)
 */
function dateFormatAddClasses(right) {
    // Update classes
    if (right) {
        dateFormatArrow.addClass('rotate90right').removeClass('rotate90left');
        dateFormatLeft.addClass('inactive');
        dateFormatRight.removeClass('inactive');
    } else {
        dateFormatArrow.addClass('rotate90left').removeClass('rotate90right');
        dateFormatRight.addClass('inactive');
        dateFormatLeft.removeClass('inactive');
    }
    
    // Update storage
    updateStorageForPreference(MONTH_FIRST, right);
}

// Hides goto box when close button is clicked
$('#gotoclose').on('click', function() {
    hideGotobox();
});

// Hides syntax box when close button is clicked
$('#syntaxclose').on('click', function() {
    hideSyntaxBox();
});

// Toggle syntax box via click on syntax label
$('#syntaxContainer').on('click', function() {
    if (gotosyntaxbox.hasClass('hiddenTrans')) {
        showSyntaxBox();
    } else {
        hideSyntaxBox();
    }
});