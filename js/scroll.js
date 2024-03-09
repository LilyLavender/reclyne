
// Scroll to an element
function scrollTo(element, speed) {
    // If "arrow" is passed in
    if (element === "arrow") {
        // Set year on calendar to current year
        let currentYearOnComputer = (new Date()).getFullYear();
        setYearTo(currentYearOnComputer);

        // Set the element to the actual element object
        element = $('.arrow-container');
    }

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
        // The subtraction bit puts the scroll so that the element is a quarter of the way down the screen
        scrollTop: element.offset().top - ($(window).height()/4)
    }, speed);
}

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
