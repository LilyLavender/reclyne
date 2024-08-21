const defaultThemeColors = [
    // Name, dark, light, accent
    // accentXX colors are generated during runtime
    ["Winter Reclyne", "#110b1d", "#d5d9f2", "#9da8ec"], 
    ["Spring Reclyne", "#0c1c0b", "#c9efce", "#53c763"], 
    ["Summer Reclyne", "#1d130b", "#fbf1b1", "##dbd150"], 
    ["Fall Reclyne", "#1d0f0b", "#f9cfb6", "#f97b39"]
];
// [hide-elapsed, autoscroll-to-arrow, all-columns, month-first, theme-number]
const defaultPreferences = [false, true, true, true, 0]; 
const outputDate = $('#output-date');
const blankColumnName = "Column";
var displayboxes = [];
var prevColumnNames = [];

// document.ready, runs when the page is loaded. Runs a lot of important code so reclyne functions properly
doc.ready(function() {
    // Create preferences data if doesn't already exists
    createPreferencesData();
    // Get preferences data
    let preferences = retrieveFromLocalStorage('reclyne-preferences');
    // Many important theme-related actions
    initializeTheme(preferences[THEME_NUMBER]);
    // Create display boxes
    createDisplayBoxes();
    // Add a height attribute to the phantom nav
    $('.phantom-nav').height($('nav').outerHeight());
    // Add current date to nav datebox
    outputDate.html((new Date()).getFullYear());
    // Add classes to month/day first selector
    displayboxes[GOTO_BOX].dateFormatAddClasses(preferences[MONTH_FIRST]);
    // Add classes to nav icons
    addClassesToNavIcons();
    // Generate calendar
    updateDate(0, preferences[AUTOSCROLL_TO_ARROW]);
    // Determine if border-radii need to be adjusted (last day of month)
    setBorderRadii();
    // Hide loading screen
    setTimeout(() => { hideLoadingScreen() }, 20);
});

/**
 * Creates preference data in localstorage if it doesn't already exist
 * <br>If preferences are invalid, recreates preferences data
 * @todo detect if an invalid theme is being used
 */
function createPreferencesData() {
    // Get preferences
    let preferences = retrieveFromLocalStorage('reclyne-preferences');
    // Create preferences if they don't exist
    if (preferences == null) {
        console.log(`Preferences data doesn't exist! Creating...`);
        updateLocalStorage('reclyne-preferences', defaultPreferences);
        console.log(`Created preferences data!`);
    // Remake preferences if length doesn't match
    } else if (preferences.length != defaultPreferences.length) {
        // If every preference in the array is the same type as the default, just recreate what's missing
        if (preferences.length < defaultPreferences.length 
        && preferences.every((pref, i) => { return typeof pref == typeof defaultPreferences[i] })) {
            for (let i = preferences.length; i < defaultPreferences.length; i++) {
                console.log(`Preference ${i} missing! Restoring...`);
                preferences.push(defaultPreferences[i]);
                updateLocalStorage('reclyne-preferences', preferences);
            }
            console.log(`Default preferences restored!`);
        // If not, just remake prefs from scratch
        } else {
            console.log(`Preferences data invalid! Recreating...`);
            updateLocalStorage('reclyne-preferences', defaultPreferences);
            console.log(`Recreated preferences data!`);
        }
    }
    // If specific preference doesn't exist, restores just that one
    preferences.forEach((pref, i) => {
        if (typeof pref != typeof defaultPreferences[i]) {
            console.log(`Preference ${i} invalid! Restoring...`);
            updateStorageForPreference(i, defaultPreferences[i])
            console.log(`Preference ${i} restored!`);
        }
    });
}

/**
 * Moves the calendar forward/back an amount of years and reloads it
 * <br>Also runs generateTable()
 * @param {*} num - Years to move the calendar forward. Can be negative, which moves the calendar backward
 * @param {*} onRefresh - Whether or not the code is being ran on refresh. This is used when scrolling to the arrow automatically
 */
async function updateDate(num, onRefresh) {
    // Open ChangesBox if unsaved changes are present
    if (saveButton.hasClass('btn-active')) {
        const result = await trySaveFromCalendarToStorage();
        if (!result) {
            return;
        }
    }
    var currDate = parseInt(outputDate.html());
    currDate += num;
    currentYear = currDate;
    outputDate.html(currDate);
    generateTable(onRefresh);
    hideAllBoxes();
}

// Moves the calendar forward one year when the nextyear button is clicked
$('#next-date-box').on('click', () => updateDate(1, false) );

// Moves the calendar back one year when the previousyear button is clicked
$('#prev-date-box').on('click', () => updateDate(-1, false) );


/**
 * Sets calendar to a specific year. Runs updateDate()
 * @param {*} yearToSetTo - Year to set the calendar to
 */
function setYearTo(yearToSetTo) {
    let yearCalendarIsOn = currentYear;
    if (yearCalendarIsOn != yearToSetTo) {
        let yearsToMove = yearToSetTo - yearCalendarIsOn;
        updateDate(yearsToMove, false);
    }
}

/**
 * Checks if it's the last day of the month, and if so, sets border radii for arrow & bottom left of table
 */
function setBorderRadii() {
    if (isLastDay(new Date())) {
        $('i.arrow-container').css('border-bottom-right-radius', '5px');
        $('.today > td:first-child').css('border-bottom-left-radius', '0');
    }
}

/**
 * Whether or not the given day is the last day of the month
 * @param {Date} dateToCheck - The date to check
 * @returns bool
 */
function isLastDay(dateToCheck) {
    let test = new Date(dateToCheck.getTime());
    test.setDate(test.getDate() + 1);
    return test.getDate() == 1;
}

/**
 * Generate calendar for the current year
 * @param {*} scroll - Whether or not to scroll to the arrow
 */
function generateTable(scroll) {
    let preferences = retrieveFromLocalStorage('reclyne-preferences');
    let tableOutput = "";
    const calEle = calendarDisplay;
    // MDO stands for month date object (verbose, i know)
    let MDO = "";
    for (let h = 0; h < 12; h++) {
        MDO = new Date(currentYear, h+1, 0);
        // Todo: see if we can optimize this bit
        let monthShort = MDO.toLocaleString('default', { month: 'short' });
        let monthLong = MDO.toLocaleString('default', { month: 'long' });
        let monthShortLower = monthShort.toLowerCase();
        let monthLongLower = monthLong.toLowerCase();
        let numOfDays = MDO.getDate();

        // RDA stands for retrived data array (verbose, i know)
        let RDA = retrieveFromLocalStorage(`${monthShort.toLowerCase()}-${currentYear}`);

        // Add opening table tag to output
        tableOutput += `<table class="${monthLongLower}-table">`;
        // Add month header to output
        tableOutput += `<h2 class="${monthLongLower}-header open" value="${monthLongLower}">${monthLong}<i class="bi bi-caret-down"></i></h2>`;
        // Add table headers to output
        let columCount = RDA ? RDA[0].length : 4;
        tableOutput += `<tr>
            <th class="non-editable-header">Date</th>`;
        for (let i = 0; i < columCount; i++) {
            let colName = RDA && RDA[0][i] ? RDA[0][i] : prevColumnNames[i] ? prevColumnNames[i] : blankColumnName;
            console.log("colName before: " + colName);
            tableOutput += `<th class="editable-header" header-num="${i+1}"><p>${colName}</p><input type="text" id="th-header-${i+1}-${monthShortLower}" class="hidden"></th>`;
            prevColumnNames[i] = prevColumnNames == blankColumnName ? null : colName;
            console.log(`prevColumnNames[${i}] after: ` + prevColumnNames[i]);
        }
        // Add main table content to output
        for (let i = 0; i < numOfDays; i++) {
            let d = new Date(currentYear, h, i+1);
            let weekDay = weekdaysShort[d.getDay()];
            // Add day in column 1 to output
            tableOutput += `<tr class="day"><td class="${weekDay}">${monthShort} ${i+1}</td>`;
            for (let j = 0; j < columCount; j++) {
                // Add data from the remaining columns
                tableOutput += `<td><input type="text" value="`;
                if (RDA) {
                    if (RDA[j+2][i]) {
                        tableOutput += RDA[j+2][i];
                    }
                }
                tableOutput += `" xpos="${j}" ypos="${i}" autocomplete="off" spellcheck="false"></td>`;
            }
            tableOutput += `</tr>`;
        }
        // Add closing table tag
        tableOutput += `</table>`;
        calEle.html(tableOutput);
    }

    // Add scrollbars to table
    $(`th.editable-header`).append(`<div class="drag-header"></div>`);

    // Bind event handler to h2 headers
    $(`h2[class*='-header']`).each(function() {
        $(this).on('click', function() {
            toggleMonthVis($(this).attr("value"));
            $(this).toggleClass("open");
        } );
    });

    // Bind event handler to th editable-headers
    $(`th.editable-header`).each(function() {
        let eh = $(this);
        let ehp = eh.find("p");
        let ehinput = eh.find("input");
        let headerNum = eh.attr('header-num');
        let pinputWidth = ehp.width();

        // When clicked, allow columns to be renamed
        eh.on("click", function() {
            let oldColumName = ehp.addClass("hidden").text();
            ehinput.val(oldColumName).width(pinputWidth).removeClass("hidden").focus();
        });

        // Save names & remove renamability from columns when unfocused
        ehinput.on("focusout", function() {
            updateSaveButtonUnsaved();
            let newColumnName = ehinput.addClass("hidden").val();
            if (newColumnName.trim() === "") { newColumnName = blankColumnName; }
            ehp.removeClass("hidden");
            // ALL_COLUMNS
            if (preferences[ALL_COLUMNS]) {
                $(`th.editable-header[header-num='${headerNum}'] > p`).text(newColumnName);
                // Update localstorage for headers so other years work as well
                // get storage
                /*let all
                for (let h = 0; h < 12; h++) {
                    let MDO = new Date(currentYear, h+1, 0);
                    let monthShort = MDO.toLocaleString('default', { month: 'short' });
                    let monthLong = MDO.toLocaleString('default', { month: 'long' });
                    let RDA = retrieveFromLocalStorage(`${monthShort.toLowerCase()}-${currentYear}`);
                }*/
                // sort so just non-current year ones

                // change header

                // save storage

            } else {
                ehp.text(newColumnName);
            }
        });
    });

    // Hide elapsed months
    if (preferences[HIDE_ELAPSED]) {
        updateElapsedMonths();
    }
    // Scroll to arrow
    if (currentYear == new Date().getFullYear()) {
        addArrow();
        if (scroll) {
            scrollToArrow(0);
        }
    }

    // Make drag-headers draggable
    dragElements($('div.drag-header'));
}

/**
 * Saves all data from calendar to localstorage
 */
function saveFromCalendarToStorage() {
    let currYear = currentYear;
    for (let h = 0; h < 12; h++) {
        let currMonthShort = monthsShort[h];
        let currMonthLong = monthsLong[h];
        let dataToStore = [];
        let currentMonthEhs = $(`.${currMonthLong}-table th.editable-header`);
        let currentMonthPs = $(`.${currMonthLong}-table th.editable-header > p`);

        // Set number of columns in dataToStore
        let columnNums = parseInt(currentMonthPs.length) + 2;
        for (let i = 0; i < columnNums; i++) {
            dataToStore[i] = [];
        }

        // Add column names and widths to dataToStore
        currentMonthEhs.each(function() {
            let eh = $(this);
            let colName = eh.find('p').text();
            let colWidth = eh.width();
            let headerNum = eh.attr('header-num') - 1;

            dataToStore[0][headerNum] = colName;
            dataToStore[1][headerNum] = colWidth;
        });

        // Add headers to dataToStore
        $(`.${currMonthLong}-table td input[type="text"]`).each(function() {
            let xpos = parseInt($(this).attr('xpos'));
            let ypos = parseInt($(this).attr('ypos'));
            let value = $(this).val();

            // Removes the section character. Section character is used to parse the reclyne-data file
            value = value.replace('§', '');
            // Stores data into proper slot in dataToStore
            if (value !== '') {
                dataToStore[xpos+2][ypos] = value;
            }
        });

        // Todo split
        // Only store data if it's not empty
        if (!dataToStore.every(function(a) { return !a.length })) {
            updateLocalStorage(`${currMonthShort}-${currYear}`, dataToStore);
            updateSaveButtonSaved(); // todo is this being ran twice?
        } else {
            // Remove empty data from storage
            removeFromLocalStorage(`${currMonthShort}-${currYear}`);
        } 
    }
    console.log("Saved!");
}

async function trySaveFromCalendarToStorage() {
    displayboxes[CHANGES_BOX].show();
    return displayboxes[CHANGES_BOX].waitForUserAction();
}

/**
 * Allows every element passed into the function to be draggable (X only)
 * @param {jQuery element array} elements 
 * @todo dragY? rename?
 */
function dragElements(elements) {
    elements.each(function() {
        var element = $(this);
        var pos1 = 0, pos3 = 0;
        element.on("mousedown", dragMouseDown);

        function dragMouseDown(e) {
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos1 = e.clientX;
            pos3 = parseInt(element.css("right"), 10) || 0;
            $(document).on("mouseup", closeDragElement);
            $(document).on("mousemove", elementDrag);
        }

        function elementDrag(e) {
            e.preventDefault();
            // calculate the horizontal movement:
            var newPos1 = e.clientX;
            var newPos3 = pos3 - (newPos1 - pos1);
            // set the element's new horizontal position:
            element.css("right", newPos3 + "px");
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            $(document).off("mouseup", closeDragElement);
            $(document).off("mousemove", elementDrag);
        }
    });
}