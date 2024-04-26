/**
 * Gets the text inside of gotoinput and returns a date object (kind of..) if it's valid
 * <br>The two bools are used in scrollToDate(). See that function for examples of their usage.
 * @returns array of [date, bool, bool]. First arg is false if text doesn't match an allowed syntax. The bools are "scroll to month" and "scroll to day" respectively. If both are false, you're just going to a year.
 * @todo make the return mechanism easier to understand
 */
function getGotoDate() {
    let input = gotoInput.val();
    let monthFirst = retrieveFromLocalStorage('reclyne-preferences')[MONTH_FIRST];
    let foundDate;

    let delimiterIndices = [...input.matchAll(/[\s-/.,]/g)].map(match => match.index);

    if (delimiterIndices.length == 0) {
        // One segment
        console.log("Delimiters: 0");

        // Jan, feb, MAR, april, May, JUNE...
        foundDate = allMonthsNames.find(function(monthName) {
            return input.toLowerCase() == monthName;
        });
        if (foundDate) {
            console.log("Date syntax #1");
            return [new Date(`${currentYear} ${foundDate}`), true, false];
        }

        // 01, 02, 3, 4...
        if ((/^(0?[1-9]|[1][0-2])$/).test(input)) {
            console.log("Date syntax #2");
            return [new Date(`${currentYear} ${input}`), true, false];
        }

        // 2024, 2025, 2026...
        if (/^\d{4}$/.test(input)) {
            if (parseInt(input) > 99) {
                // Fixes various bugs with numbers 0000-0099
                console.log("Date syntax #3");
                return [new Date(`${input} 1 1`), false, false];
            }
        }

        // jan23, apr06, may03...
        inputMonth = input.substring(0, 3);
        inputDay = input.substring(3);
        foundDate = allMonthsNames.find(function(monthName) {
            if (inputMonth.toLowerCase() == monthName 
            && (/^(0?[1-9]|[12][0-9]|3[01])$/).test(inputDay)) {
                return true;
            }
        });
        if (foundDate
        && dateIsExist(`${inputMonth} ${inputDay}`, currentYear)) {
            console.log("Date syntax #4");
            return [new Date(`${currentYear} ${inputMonth} ${inputDay}`), true, true];
        }

    } else if (delimiterIndices.length == 1) {
        // Two segments
        console.log("Delimiters: 1");
        // Split
        let inputPart1 = input.substring(0, delimiterIndices[0]);
        let inputPart2 = input.substring(delimiterIndices[0] + 1);

        // Jan 23, apr 06, june 9, OCTOBER 5...
        foundDate = allMonthsNames.find(function(monthName) {
            if (inputPart1.toLowerCase() == monthName 
            && (/^(0?[1-9]|[12][0-9]|3[01])$/).test(inputPart2)) {
                return true;
            }
        });
        if (foundDate
        && dateIsExist(`${inputPart1.substring(0,3)} ${inputPart2}`, currentYear)) {
            console.log("Date syntax #5");
            return [new Date(`${currentYear} ${inputPart1} ${inputPart2}`), true, true];
        }

        // Jan 2023, feb 2024, MARCH 2025...
        foundDate = allMonthsNames.find(function(monthName) {
            if (inputPart1.toLowerCase() == monthName 
            && (/^\d{4}$/).test(inputPart2)) {
                return true;
            }
        });
        if (foundDate) {
            console.log("Date syntax #6");
            return [new Date(`${inputPart2} ${inputPart1} 1`), true, false];
        }

        // 04 2026, 9 2027, 12 2028
        if ((/^0?[1-9]|[1][0-2]$/).test(inputPart1) 
        && (/^\d{4}$/).test(inputPart2)
        && parseInt(inputPart1) <= 12) {
            console.log("Date syntax #7");
            return [new Date(`${inputPart2} ${inputPart1} 1`), true, false];
        }

        // 1 23, 4 06, 05 3, 06 09... (gb synt)
        if (!monthFirst) [inputPart1, inputPart2] = [inputPart2, inputPart1];
        if ((/^0?[1-9]|[1][0-2]$/).test(inputPart1) 
        && (/^0?[1-9]|[12][0-9]|3[01]$/).test(inputPart2)
        && dateIsExist(`${monthsShort[parseInt(inputPart1)-1]} ${inputPart2}`, currentYear)) {
            console.log("Date syntax #8");
            return [new Date(`${currentYear} ${inputPart1} ${inputPart2}`), true, true];
        }

    } else if (delimiterIndices.length == 2) {
        // Three segments
        console.log("Delimiters: 2");
        // Split
        let inputPart1 = input.substring(0, delimiterIndices[0]);
        let inputPart2 = input.substring(delimiterIndices[0] + 1, delimiterIndices[1]);
        let inputPart3 = input.substring(delimiterIndices[1] + 1);

        // apr 08 2024, October 5 2025...
        foundDate = allMonthsNames.find(function(monthName) {
            if (inputPart1.toLowerCase() == monthName 
            && (/^(0?[1-9]|[12][0-9]|3[01])$/).test(inputPart2)
            && (/^\d{4}$/).test(inputPart3)) {
                return true;
            }
        });
        if (foundDate
        && dateIsExist(`${inputPart1.substring(0,3)} ${inputPart2}`, inputPart3)) {
            console.log("Date syntax #9");
            return [new Date(`${inputPart3} ${inputPart1} ${inputPart2}`), true, true];
        }

        // 11 11 2026, 06 03 2027, ... (gb synt)
        if (!monthFirst) [inputPart1, inputPart2] = [inputPart2, inputPart1];
        if ((/^0?[1-9]|[1][0-2]$/).test(inputPart1) 
        && (/^0?[1-9]|[12][0-9]|3[01]$/).test(inputPart2)
        && (/^\d{4}$/).test(inputPart3)
        && dateIsExist(`${monthsShort[parseInt(inputPart1)-1]} ${inputPart2}`, inputPart3)) {
            console.log("Date syntax #10");
            return [new Date(`${inputPart3} ${inputPart1} ${inputPart2}`), true, true];
        }

    } else {
        // Invalid delimiters
        console.log("Delimiters: 3+");
    }

    return [false, false, false];
}