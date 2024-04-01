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

function hideSyntaxBox() {
    gotosyntaxbox.addClass('hiddenTrans');
}

function showSyntaxBox() {
    gotosyntaxbox.removeClass('hiddenTrans');
}

$('#gotoform').on('submit', function(e) {
    e.preventDefault();
    // Get date to scroll to
    let gotoDate = getGotoDate();
    // If date is valid
    if (!!gotoDate[0]) {
        // Scroll to date
        scrollToDate(gotoDate, 400);
        // Hide gotobox
        hideGotobox();
    }
});

gotoinput.on('input', function() {
    gotoHelper();
});

$('#gotoline3').on('click', function() {
    gotoHelper();
});

// todo name this function something more descriptive
function gotoHelper() {
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

// For stuff like feburary 30th, apr 31st
function dateIsExist(date, year) {
    let formattedDate = date.toLowerCase().replace(" 0", " ");
    let dateObj = new Date(`${year} ${date}`);
    let formattedDateObj = `${monthsShort[dateObj.getMonth()]} ${dateObj.getDate()}`;

    if (formattedDate == formattedDateObj) {
        return true;
    }
    return false;
}

// Format date in Fullname Xth, yyyy
// Takes a date object and two bools
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

// Todo figure out if you can just check for the current pref instead of the class
dateFormatRight.on('click', function() {
    if (!dateFormatArrow.hasClass('rotate90right')) {
        dateFormatAddClasses(true);
    }
});

dateFormatLeft.on('click', function() {
    if (!dateFormatArrow.hasClass('rotate90left')) {
        dateFormatAddClasses(false);
    }
});

dateFormatArrow.on('click', function() {
    if (dateFormatArrow.hasClass('rotate90left')) {
        dateFormatAddClasses(true);
    } else {
        dateFormatAddClasses(false);
    }
});

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

$('#gotoclose').on('click', function() {
    hideGotobox();
});

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