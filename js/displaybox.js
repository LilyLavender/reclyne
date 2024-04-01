// Hide boxes when clicked off of
overlay.on('click', function() {
    hideAllBoxes();
});

function hideAllBoxes() {
    hideGotobox();
    hideSyntaxBox();
    hideExportBox();
    hideImportBox();
}