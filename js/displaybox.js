// Hides all boxes when an active box is clicked off of. Overlay is shown when a box is activated
overlay.on('click', function() {
    hideAllBoxes();
});

/**
 * Hides every displaybox.
 */
function hideAllBoxes() {
    hideGotobox();
    hideSyntaxBox();
    hideExportBox();
    hideImportBox();
}