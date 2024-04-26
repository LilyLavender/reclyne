const defaultThemeColors = [
    // Name, dark, light, accent
    // accentXX colors are generated during runtime
    ["Winter Reclyne", "#110b1d", "#d5d9f2", "#9da8ec"], 
    ["Spring Reclyne", "#0c1c0b", "#c9efce", "#53c763"], 
    ["Summer Reclyne", "#1d130b", "#f3e696", "#ded95a"], 
    ["Fall Reclyne", "#1d0f0b", "#f9cfb6", "#fa724c"]
];
const outputDate = $('#outputDate');

// document.ready, runs when the page is loaded. Runs a lot of important code so reclyne functions properly
doc.ready(function() {
    // Add a height attribute to the phantom nav
    $('.phantom-nav').height($('nav').outerHeight());
    // Add current date to nav datebox
    outputDate.html((new Date()).getFullYear());
    // Create preferences data if doesn't already exists
    createPreferencesData();
    // Get preferences data
    let preferences = retrieveFromLocalStorage('reclyne-preferences');
    // Add classes to month/day first selector
    dateFormatAddClasses(preferences[MONTH_FIRST]);
    // Add classes to nav icons
    addClassesToNavIcons();
    // Many important theme-related actions
    initializeTheme(preferences[THEME_NUMBER]);
    // Generate calendar
    updateDate(0, preferences[AUTOSCROLL_TO_ARROW]);
    // Todo: loading screen go here
});

/**
 * Creates preference data in localstorage if it doesn't already exist
 */
function createPreferencesData() {
    if (retrieveFromLocalStorage('reclyne-preferences') == null) {
        console.log(`Preferences data doesn't exist! Creating...`);
        // Tried getting a map to work, but no dice. 
        // reclye-preferences array is [hide-elapsed, autoscroll-to-arrow, month-first, theme-number]
        updateLocalStorage('reclyne-preferences', [false, true, true, 0]);
        console.log(`Created preferences data!`);
    }
}

/**
 * Moves the calendar forward/back an amount of years and reloads it
 * <br>Also runs generateTable()
 * @param {*} num - Years to move the calendar forward. Can be negative, which moves the calendar backward
 * @param {*} onRefresh - Whether or not the code is being ran on refresh. This is used when scrolling to the arrow automatically
 */
function updateDate(num, onRefresh) {
    getEditedYearData(currentYear);
    var currDate = parseInt(outputDate.html());
    currDate += num;
    currentYear = currDate;
    outputDate.html(currDate);
    generateTable(onRefresh);
}

// Moves the calendar forward one year when the nextyear button is clicked
$('#nextDateBox').on('click', function() {
    updateDate(1, false);
    hideAllBoxes();
});

// Moves the calendar back one year when the previousyear button is clicked
$('#prevDateBox').on('click', function() {
    updateDate(-1, false);
    hideAllBoxes();
});

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
    if (retrieveFromLocalStorage('reclyne-preferences')[HIDE_ELAPSED]) {
        updateElapsedMonths();
    }
    if (currentYear == new Date().getFullYear()) {
        addArrow();
        if (scroll) {
            scrollToArrow(scrollToArrowDelaySlow);
        }
    }
}

/**
 * Saves all data from calendar to localstorage
 * @param {string} currYear - The year to save the data for. Pretty sure it doesn't work if you put in a year other than the current one
 * @todo Rename, remove argument necessity
 */
function getEditedYearData(currYear) {
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
            updateSaveButtonSaved();
        } else {
            // Remove empty data from storage
            removeFromLocalStorage(`${currMonthShort}-${currYear}`);
        } 
    }
}