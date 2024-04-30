/**
 * Adds arrow to the correct row of the calendar
 * <br>The function does this by getting the current date, finding the .day element with the current day in its text, and then appending a new element to the end of it. 
 * <br>Prepending instead of appending causes the whole row to shift over. The arrow is just moved over to the other side via CSS.
 */
function addArrow() {
    const currDate = new Date();
    const currDay = currDate.getDate();
    const currMonth = currDate.toLocaleString('en-US', { month: 'short' });
    $(`.day:contains(${currMonth} ${currDay})`).addClass('today').append($(`<i class="bi bi-arrow-right arrow-container"></i>`));
}

// Scroll to arrow when it's clicked. Uses event delegation on the document because .arrow-container is added during runtime
doc.on('click', '.arrow-container', function() {
    scrollToArrow(scrollToArrowDelayFast);
});