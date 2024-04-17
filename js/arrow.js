// Add arrow to correct row
function addArrow() {
    const currDate = new Date();
    const currDay = currDate.getDate();
    const currMonth = currDate.toLocaleString('en-US', { month: 'short' });
    $(`.day:contains(${currMonth} ${currDay})`).append($(`<i class="bi bi-arrow-right arrow-container"></i>`));
}

// Scroll to arrow when clicked
doc.on('click', '.arrow-container', function() {
    scrollToArrow(scrollToArrowDelayFast);
});