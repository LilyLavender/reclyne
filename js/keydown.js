// Controls keyboard shortcuts
doc.on('keydown', function(e) {
    if (e.ctrlKey) {
        if (e.key === 's') {
            e.preventDefault();
            saveButton.click();
        } else if (e.key === 'ArrowRight') {
            // if statement is necessary so ctrl right arrow still works in text boxes
            if ($('input:focus').length == 0) {
                e.preventDefault();
                scrollToArrow(scrollToArrowDelayFast);
            }
        } else if (e.key === 'g') {
            e.preventDefault();
            displayboxes[GOTO_BOX].toggle();
        } else if (e.key === 'e') {
            e.preventDefault();
            $('#all-columns-button').click();
        }
    } else if (e.key === "Escape") {
        hideAllBoxes();
    }
})