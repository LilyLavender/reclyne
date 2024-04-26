/**
 * Saves one preference to localstorage
 * @param {int} prefNum - The number of preference found in the preferences array
 * @param {bool|int} setting - The value of the preference
 */
function updateStorageForPreference(prefNum, setting) {
    let preferences = retrieveFromLocalStorage(`reclyne-preferences`);
    preferences[prefNum] = setting;
    updateLocalStorage(`reclyne-preferences`, preferences);
}

// Save all data in the calendar to localstorage when save button is clicked. Also updates save button CSS
saveButton.on('click', function() {
    if (saveButton.hasClass('btn-active')) {
        getEditedYearData(currentYear);
        updateSaveButtonSaved();
        console.log("Saved!");
    }
});

/**
 * Save data to localstorage
 * @param {string} slotToStore - The name of the slot to store
 * @param {*} dataToStore - The data to store
 */
function updateLocalStorage(slotToStore, dataToStore) {
    localStorage.setItem(slotToStore, JSON.stringify(dataToStore));
}

/**
 * Remove data from local storage
 * @param {string} dataToRemove - The slot of the data to remove
 */
function removeFromLocalStorage(dataToRemove) {
    localStorage.removeItem(dataToRemove);
}

/**
 * Retrieve data from localstorage
 * @param {string} dataToRetrieve The slot of the data to retrieve
 * @returns Data stored in the specified slot. Can be any type (minus a map)
 */
function retrieveFromLocalStorage(dataToRetrieve) {
    if (localStorage.getItem(dataToRetrieve)) 
        return JSON.parse(localStorage.getItem(dataToRetrieve));
}