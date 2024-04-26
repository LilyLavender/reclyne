// Toggle month visibility based on clicked h2 header. Uses event delegation on calendarDisplay because h2 headers are added during runtime
calendarDisplay.on('click', `h2[class*="-header"]`, function(e) {
    // Get specific header
    let header = $(e.target);
    // Toggle month visibility
    toggleMonthVis(header.attr("value"));
    // Toggle classes on header
    header.toggleClass("open");
});

/**
 * Toggles the hidden class for a specific month header
 * @param {string} monthToHide - The month to toggle the visibility of
 */
function toggleMonthVis(monthToHide) {
    $(`.${monthToHide}-table`).toggleClass("hidden");
}

/**
 * Hide elapsed months by clicking on them
 * <br>The check for if the user has the hide-elapsed-months preference is in main->generateTable()
 * @fires click for h2 headers
 */
function updateElapsedMonths() {
    if (currentYear == new Date().getFullYear()) {
        let currentMonthLong = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
        let indexOfCurrentMonth = monthsLong.indexOf(currentMonthLong);
        for (i = 0; i < indexOfCurrentMonth; i++) {
            $(`h2[class^="${monthsLong[i]}-header"]`).click();
        }
    }
}