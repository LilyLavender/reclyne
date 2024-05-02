/**
 * Checks if a date exists
 * @param {Date} date - The day/month combo to check. Year is ignored
 * @param {string} year - The year to check
 * @returns True for a valid date (eg 12/15/2024) and false for an invalid date (eg 02/29/2023, 06/31/2024)
 */
function dateIsExist(date, year) {
    let formattedDate = date.toLowerCase().replace(" 0", " ");
    let dateObj = new Date(`${year} ${date}`);
    let formattedDateObj = `${monthsShort[dateObj.getMonth()]} ${dateObj.getDate()}`;

    if (formattedDate == formattedDateObj) {
        return true;
    }
    return false;
}

/**
 * Formats a date in Fullname Xth, yyyy
 * @param {Date} date - Date object to format
 * @param {bool} isMonth - Whether or not to include the month. If false, just returns the year as a string
 * @param {bool} isDay - Whether or not to include the day. If false, returns a format such as "January 2024"
 * @returns string of the date object in Fullname Xth, yyyy (eg August 3rd, 2022)
 */
function getPrettyDate(date, isMonth, isDay) {
    var daySuffixes = ["st", "nd", "rd", "th"];
    var day = date.getDate();
    var daySuffixes;
    if (day >= 11 && day <= 13) {
        daySuffixes = "th";
    } else {
        daySuffixes = daySuffixes[(day - 1) % 10] || "th";
    }
    let ret = "";
    if (isMonth) ret += monthsLongUpper[date.getMonth()] + " ";
    if (isDay) ret += day + daySuffixes + ", ";
    ret += date.getFullYear();
    return ret;
}

class GotoBox extends DisplayBox {
    /**
     * The gotobox. Handles going to dates
     */
    constructor() {
        super('goto-box', 'goto');
        // Properties 
        this.input = $('#goto-input');
        this.preview = $('#goto-preview');
        this.previewHelper = $('#goto-preview-helper');
        this.dateFormatArrow = $('#date-format-arrow');
        this.dateFormatLeft = $('p:has(+ #date-format-arrow)');
        this.dateFormatRight = $('#date-format-arrow + p');
        
        // Event listeners
        this.input.on('input', () => this.showDatePreview()); // Show preview of date when typing
        // Update locale switcher when elements are clicked
        this.dateFormatRight.on('click', () => this.dateFormatAddClasses(true));
        this.dateFormatLeft.on('click', () => this.dateFormatAddClasses(false));
        this.dateFormatArrow.on('click', () => this.toggleDateFormat());
        $('#goto-form').on('submit', (e) => { this.handleFormSubmit(e) }); // Goto date when pressing enter in gotoinput
        $('#goto-submit-button').on('click', (e) => { this.handleFormSubmit(e) }); // Goto date when clicking the goto button
        $('#goto-line-3').on('click', () => { this.showDatePreview(); }); // Show preview of date when locale switcher elements are clicked
    }
    
    // Overrides
    showHelper() {
        // Put cursor in text box
        this.input.focus();
        // Super
        super.showHelper();
    }

    hideHelper() {
        // Super
        super.hideHelper();
        // Hide syntax box
        displayboxes[GOTO_SYNTAX_BOX].hide();
        // Clear & unfocus gotoInput
        this.input.val('').blur();
        // Clear preview box & helper
        this.previewHelper.html("Preview will show up here").addClass('inactive');
        this.preview.html("");
    }

    // Methods
    /**
     * Goes to the date from gotoinput
     * @param {event} e - Should come from an event listener. Used for e.preventDefault();
     */
    handleFormSubmit(e) {
        e.preventDefault();
        // Get date to scroll to
        let gotoDate = getGotoDate();
        // If date is valid
        if (!!gotoDate[0]) {
            // Scroll to date
            scrollToDate(gotoDate, scrollToDateDelay);
            // Hide all boxes
            hideAllBoxes();
        }
    }

    /**
     * Shows the preview of the date the user is going to in gotoPreviewHelper & gotoPreview
     */
    showDatePreview() {
        let gotoDate = getGotoDate();
        if (!gotoDate[0]) {
            // Date in preview box invalid
            this.previewHelper.html("Preview will show up here").addClass('inactive');
            this.preview.html("");
        } else {
            // Date in preview box valid
            this.previewHelper.html("Going to:").removeClass('inactive');
            this.preview.html(getPrettyDate(gotoDate[0], gotoDate[1], gotoDate[2]));
        }
    }

    /**
     * Controls CSS of the locale switcher
     * <br>Also updates localstorage for the preference
     * @param {bool} right - If the arrow should point right (false is left)
     */
    dateFormatAddClasses(right) {
        // Update classes
        if (right) {
            if (!this.dateFormatArrow.hasClass('rotate90right')) {
                this.dateFormatArrow.addClass('rotate90right').removeClass('rotate90left');
                this.dateFormatLeft.addClass('inactive');
                this.dateFormatRight.removeClass('inactive');
            }
        } else {
            if (!this.dateFormatArrow.hasClass('rotate90left')) {
                this.dateFormatArrow.addClass('rotate90left').removeClass('rotate90right');
                this.dateFormatRight.addClass('inactive');
                this.dateFormatLeft.removeClass('inactive');
            }
        }
        
        // Update storage
        updateStorageForPreference(MONTH_FIRST, right);
    }

    /**
     * Toggles CSS of locale switcher via dateFormatAddClasses()
     */
    toggleDateFormat() {
        if (this.dateFormatArrow.hasClass('rotate90left')) {
            this.dateFormatAddClasses(true);
        } else {
            this.dateFormatAddClasses(false);
        }
    }

}

class SyntaxBox extends DisplayBox {
    /**
     * SyntaxBox that displays many different syntaxes for the gotobox
     * @class
     */
    constructor() {
        super('goto-syntax-box', 'goto-syntax');

        // Event listeners
        $('#syntax-container').on('click', () => this.toggle());
    }
    
    // Overrides
    showHelper() {
        // Visually show box
        this.element.removeClass('hidden-trans');
        // Update shown prop
        this.setShown = true;
    }

    hideHelper() {
        // Visually hide box
        this.element.addClass('hidden-trans');
        // Update shown prop
        this.setShown = false;
    }
}