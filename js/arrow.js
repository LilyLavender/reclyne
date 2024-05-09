/**
 * Adds arrow to the correct row of the calendar
 * <br>The function does this by getting the current date, finding the .day element with the current day in its text, and then appending a new element to the end of it. 
 * <br>Prepending instead of appending causes the whole row to shift over. The arrow is just moved over to the other side via CSS.
 */
function addArrow() {
    const currDate = new Date();
    const currDay = currDate.getDate();
    const currMonth = currDate.toLocaleString('en-US', { month: 'short' });
    let arrowEle = $(`<i class="bi bi-arrow-right arrow-container"></i>`);
    $('.day').filter(function(){ return $(this).text() === `${currMonth} ${currDay}`}).addClass('today').append(arrowEle);
    arrowEle.on('click', () => { scrollToArrow(scrollToArrowDelayFast) });
}