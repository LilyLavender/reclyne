const loadingScreen = $('#loading-screen');
const loadingMsg = $('#loading-message');

/**
 * Sets the "Loading..." message on the loading screen. Currently unused
 * @param {string} msg - The message to set to
 */
function setLoadingMsg(msg) {
    loadingMsg.text(msg);
}

/**
 * Shows the loading screen. Currently unused
 */
function showLoadingScreen() {
    loadingScreen.removeClass('hidden-trans');
}

/**
 * Hides the loading screen
 */
function hideLoadingScreen() {
    loadingScreen.addClass('hidden-trans');
}