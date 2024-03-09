// 
function updateStorageForPreference(prefNum, setting) {
    let preferences = retrieveFromLocalStorage(`reclyne-preferences`);
    preferences[prefNum] = setting;
    updateLocalStorage(`reclyne-preferences`, preferences);
}

// Save data to local storage
$('#saveButton').on('click', function() {
    getEditedYearData(currentYear);
    $(this).removeClass("btn-active");
});

// Add data to local storage
function updateLocalStorage(slotToStore, dataToStore) {
    localStorage.setItem(slotToStore, JSON.stringify(dataToStore));
}

// Remove data from local storage
function removeFromLocalStorage(dataToRemove) {
    localStorage.removeItem(dataToRemove);
}

// Get data out of local storage
function retrieveFromLocalStorage(dataToRetrieve) {
    if (localStorage.getItem(dataToRetrieve)) 
        return JSON.parse(localStorage.getItem(dataToRetrieve));
}