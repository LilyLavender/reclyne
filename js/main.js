const defaultThemeColors = [
    // Name, dark, light, accent
    // accentXX colors are generated during runtime
    ["Winter Reclyne", "#110b1d", "#d5d9f2", "#9da8ec"], 
    ["Spring Reclyne", "#0c1c0b", "#c9efce", "#53c763"], 
    ["Summer Reclyne", "#1d130b", "#f3e696", "#ded95a"], 
    ["Fall Reclyne", "#1d0f0b", "#f9cfb6", "#fa724c"]
];
// [hide-elapsed, autoscroll-to-arrow, month-first, theme-number]
const defaultPreferences = [false, true, true, 0]; 
const outputDate = $('#output-date');
var displayboxes = [];

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
    let tableOutput = "";
    const calEle = calendarDisplay;
    // MDO stands for month date object (verbose, i know)
    let MDO = "";
    for (let h = 0; h < 12; h++) {
        MDO = new Date(currentYear, h+1, 0);
        // Todo: see if we can optimize this bit
        let monthShort = MDO.toLocaleString('default', { month: 'short' });
        let monthLong = MDO.toLocaleString('default', { month: 'long' });
        let monthLongLower = monthLong.toLowerCase();
        let numOfDays = MDO.getDate();

        // RDA stands for retrived data array (verbose, i know)
        let RDA = retrieveFromLocalStorage(`${monthShort.toLowerCase()}-${currentYear}`);

        // Add opening table tag to output
        tableOutput += `<table class="${monthLongLower}-table">`;
        // Add month header to output
        tableOutput += `<h2 class="${monthLongLower}-header open" value="${monthLongLower}">${monthLong}<i class="bi bi-caret-down"></i></h2>`;
        // Add table headers to output
        tableOutput += `<tr><th>Date</th><th>Column 1</th><th>Column 2</th><th>Column 3</th><th>Column 4</th></tr>`;
        for (let i = 0; i < numOfDays; i++) {
            let d = new Date(currentYear, h, i+1);
            let weekDay = weekdaysShort[d.getDay()];
            // Add day in column 1 to output
            tableOutput += `<tr class="day"><td class="${weekDay}">${monthShort} ${i+1}</td>`;
            for (let j = 0; j < 4; j++) {
                // Add data from the remaining columns
                tableOutput += `<td><input type="text" value="`;
                if (RDA) {
                    if (RDA[j][i]) {
                        tableOutput += RDA[j][i];
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

    // Bind event handler to h2 headers
    $(`h2[class*='-header']`).each(function() {
        $(this).on('click', function() {
            toggleMonthVis($(this).attr("value"));
            $(this).toggleClass("open");
        } );
    });

    // Hide elapsed months
    if (retrieveFromLocalStorage('reclyne-preferences')[HIDE_ELAPSED]) {
        updateElapsedMonths();
    }
    // Scroll to arrow
    if (currentYear == new Date().getFullYear()) {
        addArrow();
        if (scroll) {
            scrollToArrow(0);
        }
    }
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
        for (let i = 0; i < 4; i++) {
            dataToStore[i] = [];
        }
        $(`.${currMonthLong}-table input[type="text"]`).each(function() {
            let xpos = $(this).attr('xpos');
            let ypos = $(this).attr('ypos');
            let value = $(this).val();

            // Removes the section character. Section character is used to parse the reclyne-data file
            value = value.replace('§', '');
            // Stores data into proper slot in dataToStore array
            if (value !== '') {
                dataToStore[xpos][ypos] = value;
            }
        });

        // Todo split
        // Only store data if it's not empty
        if (!dataToStore.every(function(a) { return !a.length })) {
            updateLocalStorage(`${currMonthShort}-${currYear}`, dataToStore);
            updateSaveButtonSaved(); // todo is this being ran twice
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