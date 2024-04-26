const exportbox = $('#export-data-box');
const exportForm = $('#export-form');
const exportError = $('#export-error');
const exportline2 = $('#export-line-2');
const exportButtons = $('#export-buttons');
const exportButtonSubmit = $('#export-button-submit');
const exportDataButton = $('#export-data-button');
const dataToPort = new Map();
const dblclickDelay = 200;
const maxGridSize = 9;

var exportDataTimer;

// Show export box when export nav button is clicked
exportDataButton.on('click', function(e) {
    if (exportDataTimer) clearTimeout(exportDataTimer);
    exportDataTimer = setTimeout(function() { 
        showExportBox();
    }, dblclickDelay);  
});

// Immediately exports all data in reclyne when export nav button is double-clicked
exportDataButton.on('dblclick', function(e) {
    clearTimeout(exportDataTimer);
    saveReclyneData();
});

// Hides export box when close button is clicked
$('#export-close').on('click', function() {
    hideExportBox();
});

// Exports select data in reclyne when the "export data" button in the export box is clicked
exportButtonSubmit.on('click', function() {
    // Makes sure button is active
    if (!$(this).hasClass('inactive')) {
        // Only if data was saved, hide the export box
        if (saveReclyneData()) hideExportBox();
    }
});

// Hides export box when cancel button is clicked
$('#export-button-cancel').on('click', function() {
    hideExportBox();
});

// Selects everything to be exported when the "all" button in the export box is clicked
$('#export-button-all').on('click', function() {
    [...dataToPort.keys()].forEach((key) => dataToPort.set(key, true));
    [exportline2.children()].forEach((child) => child.children().removeClass('inactive'));
    exportButtonSubmit.removeClass('inactive');
});

// Selects nothing to be exported when the "none" button in the export box is clicked
$('#export-button-none').on('click', function() {
    [...dataToPort.keys()].forEach((key) => dataToPort.set(key, false));
    [exportline2.children()].forEach((child) => child.children().addClass('inactive'));
    exportButtonSubmit.addClass('inactive');
});

/**
 * Shows the export box. 
 * <br>Also populates it with data from the file gotten from the user
 */
function showExportBox() {
    // Clear all other boxes
    hideAllBoxes();
    // Populate box with proper data
    populateExportBox();
    // Visually show box
    exportbox.removeClass('hidden-trans');
    // Show overlay
    overlay.removeClass('hidden');
}

/**
 * Hides the export box. 
 */
function hideExportBox() {
    if (!exportbox.hasClass('hidden-trans')) {
        // Visually hide box
        exportbox.addClass('hidden-trans');
        // Hide overlay
        overlay.addClass('hidden');
        // Clear dataToPort map
        dataToPort.clear();
    }
}

/**
 * Fills the export box with all "month-year" data found in localstorage
 */
function populateExportBox() {
    // Get names of all localStorage objects
    let keys = Object.keys(localStorage);
    // Declare important vars
    let i = keys.length;
    let allKeys = [];

    // Add all data into allKeys array
    while (i--) {
        // Make sure data is actually reclyne's data
        if (/^[a-z]{3}-\d{4}$/.test(keys[i].toString())) {
            // Add key to array
            allKeys.push(keys[i]);
        }
    }
    
    // If no data, display error
    if (allKeys.length == 0) {
        // Hide form
        exportForm.hide();
        // Show error p
        exportError.show();
        exportError.html('No data in reclyne! Try adding something first');
        // End function
        return;
    } else {
        // Show form
        exportForm.show();
        // Hide error p
        exportError.hide();
    }
    
    // If only one item, remove all and none buttons
    if (allKeys.length == 1) {
        // Hide buttons
        exportButtons.hide();
    } else {
        // Show buttons
        exportButtons.show();
    }

    // Sort allKeys array by month
    let allKeysSort = sortAllKeys(allKeys);

    //Clear html
    exportline2.html('');
    // Add elements to html
    allKeysSort.forEach((element) => {
        let eleParts = element.split('-');
        eleParts[0] = eleParts[0].charAt(0).toUpperCase() + eleParts[0].slice(1);
        exportline2.append(`<div class="export-cont-${element}"><p class="export-p-${element}" data-key="${element}">${eleParts[0]} ${eleParts[1]}</p></div>`);
        dataToPort.set(element, true);
    });
    let numItems = exportline2.children().length;
    let gridSize = Math.ceil(Math.sqrt(numItems));
    if (gridSize > maxGridSize) { gridSize = maxGridSize; }
    exportline2.css('grid-template-columns', `repeat(${gridSize}, 1fr)`);
}

// Allows toggling of an exportbox item on and off when clicked. Uses event delegation on exportline2 because exportbox items are added during runtime
exportline2.on('click', 'div[class^="export-cont-"]', function(e) {
    // Set value of key on click
    let tar = $(e.target);
    let key = tar.data("key");
    if (dataToPort.get(key)) {
        tar.addClass('inactive');
        dataToPort.set(key, false);
    } else {
        tar.removeClass('inactive');
        dataToPort.set(key, true);
    }
    
    // Grey out submit button if every value is false
    if (dataToPort.values().every((v) => v === false)) {
        exportButtonSubmit.addClass('inactive');
    } else {
        exportButtonSubmit.removeClass('inactive');
    }
});

/**
 * Creates reclyne-data file and downloads it
 * @returns True if data was successfully saved, error message as a string otherwise
 */
function saveReclyneData() {
    // Get names of all localStorage objects
    let keys = Object.keys(localStorage);
    // Declare important vars
    let i = keys.length;
    let allStorage = [];

    // Add all data into allStorage array
    while (i--) {
        // Make sure data is actually reclyne's data
        if (/^[a-z]{3}-\d{4}$/.test(keys[i].toString())
        /*|| keys[i].includes("reclyne")*/) { // The commented part of the if is for the reclyne-preferences file. It was decided to not let the user import/export this, but this may change as reclyne-preferences grows larger
            // Add key to first column & data to second
            allStorage.push([keys[i], localStorage.getItem(keys[i])]);
        }
    }
    
    // Don't export if there's no data
    // (this function can't actually run usually if there's no data, since the form would be hidden)
    // (exists purely for debugging)
    if (allStorage.length == 0) {
        return 'No data in reclyne! Try adding something first';
    }

    // Restrict allStorage array to only the active keys
    let allStorageRestricted = restrictAllStorage(allStorage);

    // Sort allStorage array by month
    let allStorageSort = sortAllStorage(allStorageRestricted);

    // Saves allStorage array to allStorageStr string
    let allStorageStr = "";
    for (i = 0; i < allStorageSort.length; i++) {
        allStorageStr += `${allStorageSort[i][0]} § ${allStorageSort[i][1]}`;
        if (i < allStorageSort.length - 1) {
            allStorageStr += `\n`;
        }
    }
    
    // Download File
    downloadFile(allStorageStr, `reclyne-data-${getVerboseDateTime()}.txt`);

    return true;
}

/**
 * Downloads a file with the given content and name
 * @param {string} fileContent - The content within the file
 * @param {string} fileName - The name of the file
 */
function downloadFile(fileContent, fileName) {
    let blob = new Blob([fileContent], { type: "text/plain" });
    // Download reclyne data file
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Sorts allStorage array by year, then month
 * <br>Sorts in chronological order, ie jan-2024 comes before apr-2024
 * @param {string[]} allStorage - Array of key and data pairs from localstorage
 * @returns allStorage, sorted
 */
function sortAllStorage(allStorage) {  
    allStorage.sort((a, b) => {
        // For reclyne-preferences file
        //if (a[0] == "reclyne-preferences") return -1;
        //if (b[0] == "reclyne-preferences") return 1;
  
        const [monthA, yearA] = a[0].split('-');
        const [monthB, yearB] = b[0].split('-');
  
        if (yearA !== yearB) {
            return parseInt(yearA) - parseInt(yearB);
        } else {
            return monthsShort.indexOf(monthA) - monthsShort.indexOf(monthB);
        }
    });
    return allStorage;
}

/**
 * Removes all keys from allStorage that aren't active in the dataToPort map
 * @param {string[]} allStorage - Array of key and data pairs from localstorage
 * @returns allStorage, only with keys present in the dataToPort map
 */
function restrictAllStorage(allStorage) {
    let ret = [];
    allStorage.forEach(element => {
        if (dataToPort.get(element[0]) != false) {
            ret.push(element);
        }
    });
    return ret;
}

/**
 * Sorts allKeys array by year, then month
 * <br>Sorts in chronological order, ie jan-2024 comes before apr-2024
 * @param {string[]} allKeys - Array of keys from localstorage
 * @returns allkeys, sorted
 * @todo This might not be needed, if we get rid of allStorage completely in favor of allKeys
 */
function sortAllKeys(allKeys) {  
    allKeys.sort((a, b) => {
        const [monthA, yearA] = a.split('-');
        const [monthB, yearB] = b.split('-');
  
        if (yearA !== yearB) {
            return parseInt(yearA) - parseInt(yearB);
        } else {
            return monthsShort.indexOf(monthA) - monthsShort.indexOf(monthB);
        }
    });
    return allKeys;
}

/**
 * Get current date & time in format yyyy-mm-dd-hh-mm-ss
 * @returns String in the format of yyyy-mm-dd-hh-mm-ss
 * @todo is this best in the export.js file? It's only used in it but it's more of a main function
 */
function getVerboseDateTime() {
    let date = new Date();
    
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    
    // Pads with zeroes
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    
    return year + "-" + month + "-" + day + "-" + hour + "-" + minute + "-" + second;
}