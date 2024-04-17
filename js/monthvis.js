// Toggle month visibility based on clicked h2 header
calendarDisplay.on('click', `h2[class*="-header"]`, function(e) {
    // Get specific header
    let header = $(e.target);

    // Toggle month visibility
    toggleMonthVis(header.attr("value"));

    // Toggle classes on header
    header.toggleClass("open");
});

function toggleMonthVis(monthToHide) {
    $(`.${monthToHide}-table`).toggleClass("hidden");
}

// Hide elapsed months
function updateElapsedMonths() {
    if (currentYear == new Date().getFullYear()) {
        let currentMonthLong = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
        let indexOfCurrentMonth = monthsLong.indexOf(currentMonthLong);
        for (i = 0; i < indexOfCurrentMonth; i++) {
            $(`h2[class^="${monthsLong[i]}-header"]`).click();
        }
    }
}