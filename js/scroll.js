const scrollToArrowDelayFast = 300;
const scrollToArrowDelaySlow = 600;
const scrollToDateDelay = 400;

// Scroll to an element
function scrollTo(element, speed) {
    // If element isn't shown, show it
    if (element.is(":hidden")) {
        parement = element.parent();
        while (true) {
            parement = parement.parent();
            if (parement.is('[class *= -table]')) {
                parement.prev().click();
                break;
            }
        }
    }

    // Move scroll
    $('html').animate({
        // Set scrollTop to:
        // The top of the element to scroll to
        // Minus the height of the screen divided by 4 (so it puts the element at eye height)
        // Plus 3px (so that the scroll lines up slightly better with table rows)
        scrollTop: element.offset().top - ($(window).height()/4) + 3
    }, speed);
}

// Scroll to the arrow (calls scrollTo)
function scrollToArrow(speed) {
    // Set year on calendar to current year
    let currentYearOnComputer = (new Date()).getFullYear();
    setYearTo(currentYearOnComputer);

    scrollTo($('.arrow-container'), speed);
}

// Scroll to a date (calls scrollTo)
function scrollToDate(dateArray, speed) {
    // Change year
    let scrollToYear = dateArray[0].getFullYear();
    if (scrollToYear != currentYear) setYearTo(scrollToYear);

    // Scroll
    let elementToScrollTo;
    if (dateArray[1]) {
        if (dateArray[2]) {
            // Day & month
            let formattedDate = monthsShortUpper[dateArray[0].getMonth()] + " " + dateArray[0].getDate();
            let dateContainer = $(`td:contains('${formattedDate}')`); 
            elementToScrollTo = dateContainer;
        } else {
            // Just month
            let formattedMonth = monthsLong[dateArray[0].getMonth()];
            let monthHeader = $(`h2[class^="${formattedMonth}-header"]`);
            elementToScrollTo = monthHeader;
        }
    } else {
        // Just year
        elementToScrollTo = $('.phantom-nav');
    }
    scrollTo(elementToScrollTo, speed);
}
