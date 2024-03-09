// 
$(document).on('keydown', function(e) {
    if (e.ctrlKey) {
        if (e.key === 's') {
            e.preventDefault();
            $('#saveButton').click();
        } else if (e.key === 'ArrowRight') {
            // if statement is necessary so ctrl right arrow still works in text boxes
            if ($('input:focus').length == 0) {
                e.preventDefault();
                scrollTo("arrow", 300);
            }
        } else if (e.key === 'g') {
            e.preventDefault();
            if (gotobox.hasClass('hiddenTrans')) {
                showGotobox();
            } else {
                hideGotobox();
            }
        }
    } else if (e.key === "Escape") {
        hideAllBoxes();
    }
})