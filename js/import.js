const importbox = $('#import-data-box');
const importForm = $('#import-form');
const importError = $('#import-error');
const importline2 = $('#import-line-2');
const importButtons = $('#import-buttons');
const importButtonSubmit = $('#import-button-submit');
const importDataButton = $('#import-data-button');
let keysLocal = [];
let datasLocal = [];
let allKeysLocal = []; // todo deduce necessity of this

var importDataTimer;

// Show import box when export nav button is clicked
importDataButton.on('click', function(e) {
    if (importDataTimer) clearTimeout(importDataTimer);
    importDataTimer = setTimeout(function() { 
        loadReclyneData(false);
    }, dblclickDelay);  
});

// Quick import when import nav button is double-clicked
importDataButton.on('dblclick', function(e) {
    clearTimeout(importDataTimer);
    loadReclyneData(true);
});

// Hides import box when close button is clicked
$('#import-close').on('click', function() {
    hideImportBox();
});

// Imports select data from reclyne data file when the "import data" button in the import box is clicked
importButtonSubmit.on('click', function() {
    // Makes sure button is active
    if (!$(this).hasClass('inactive')) {
        // Only if data was saved, hide the import box
        if (loadReclyneData2()) { hideImportBox(); }
    }
});

// Hides import box when cancel button is clicked
$('#import-button-cancel').on('click', function() {
    hideImportBox();
});

// Selects everything to be imported when the "all" button in the import box is clicked
$('#import-button-all').on('click', function() {
    [...dataToPort.keys()].forEach((key) => dataToPort.set(key, true));
    [importline2.children()].forEach((child) => child.children().removeClass('inactive'));
    importButtonSubmit.removeClass('inactive');
});

// Selects nothing to be imported when the "none" button in the import box is clicked
$('#import-button-none').on('click', function() {
    [...dataToPort.keys()].forEach((key) => dataToPort.set(key, false));
    [importline2.children()].forEach((child) => child.children().addClass('inactive'));
    importButtonSubmit.addClass('inactive');
});

/**
 * Shows the import box
 * <br>Also populates the import box with data from the reclyne-data file
 */
function showImportBox() {
    // Clear all other boxes
    hideAllBoxes();
    // Populate box with proper data
    populateImportBox();
    // Visually show box
    importbox.removeClass('hidden-trans');
    // Show overlay
    overlay.removeClass('hidden');
}

/**
 * Hides the import box
 */
function hideImportBox() {
    if (!importbox.hasClass('hidden-trans')) {
        // Visually hide box
        importbox.addClass('hidden-trans');
        // Hide overlay
        overlay.addClass('hidden');
        // Clear dataToPort map
        dataToPort.clear();
    }
}

/**
 * Populates the import box with all month-day keys from reclyne-data file
 */
function populateImportBox() {
    // Get all data from imported file
    let allKeys = allKeysLocal;

    // If no data, display error
    if (allKeys.length == 0) {
        // Hide form
        importForm.hide();
        // Show error p
        importError.show();
        importError.html('No data was found in file');
        // End function
        return;
    } else {
        // Show form
        importForm.show();
        // Hide error p
        importError.hide();
    }

    // If only one item, remove all and none buttons
    if (allKeys.length == 1) {
        // Hide buttons
        importButtons.hide();
    } else {
        // Show buttons
        importButtons.show();
    }

    // Sort allKeys array by month
    let allKeysSort = sortAllKeys(allKeys);

    // Remove duplicate keys
    let allKeysFinal = [...new Set(allKeysSort)];

    //Clear html
    importline2.html('');
    // Add elements to html
    allKeysFinal.forEach((element) => {
        let eleParts = element.split('-');
        eleParts[0] = eleParts[0].charAt(0).toUpperCase() + eleParts[0].slice(1);
        importline2.append(`<div class="import-cont-${element}"><p class="import-p-${element}" data-key="${element}">${eleParts[0]} ${eleParts[1]}</p></div>`);
        dataToPort.set(element, true);
    });
    let numItems = importline2.children().length;
    let gridSize = Math.ceil(Math.sqrt(numItems));
    if (gridSize > maxGridSize) { gridSize = maxGridSize; }
    importline2.css('grid-template-columns', `repeat(${gridSize}, 1fr)`);
}

// Allows toggling of an importbox item on and off when clicked. Uses event delegation on importline2 because importbox items are added during runtime
importline2.on('click', 'div[class^="import-cont-"]', function(e) {
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
        importButtonSubmit.addClass('inactive');
    } else {
        importButtonSubmit.removeClass('inactive');
    }
});

/**
 * Pulls up the file upload option for the user to import their reclyne-data file
 * @param {bool} quickImport - Quick import - whether or not to display the import box
 */
function loadReclyneData(quickImport) {
    // Upload reclyne-data file
    let d = document.createElement("input");
    d.setAttribute('type', 'file');
    d.setAttribute('id', 'fileinput');
    document.body.appendChild(d);
    d.addEventListener('change', function() {
        // Get file
        let myFile = new Blob([$('#fileinput').prop('files')[0]]);

        let keys = [];
        let datas = [];
        // Read contents of file
        const fr = new FileReader();
        fr.onload = () => {
            // Split file by lines
            let linesO = fr.result.split('\n');
            for (let i = 0; i < linesO.length; i++) {
                // Split lines by delimiter char
                lineParts = linesO[i].split(' § ');
                // Save split lines to keys and datas array
                keys.push(lineParts[0]);
                datas.push(JSON.parse(lineParts[1]));
            }

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
            
            // Display import box if not quick import
            if (!quickImport) {
                allKeysLocal = allKeys;
                showImportBox();
            }

            // Save keys and datas to local variants
            keysLocal = keys;
            datasLocal = datas;

            if (quickImport) {
                loadReclyneDataQuick();
            }
        };
        fr.readAsText(myFile);
        document.body.removeChild(d);
    });
    d.click();
}

/**
 * Saves all data from reclyne-data file to localstorage
 * <br>Also restricts data based on only what the user wants to import
 * @returns True if data was successfully saved
 * @todo Rename
 */
function loadReclyneData2() {
    // Restrict data to store
    let restrictedData = restrictAllStorage2(keysLocal, datasLocal);

    // Save data to localstorage
    for (let i = 0; i < restrictedData.length; i++) {
        updateLocalStorage(restrictedData[i][0], restrictedData[i][1]);
    }

    // Refresh table
    generateTable(false);

    return true;
}

/**
 * Saves all data from reclyne-data file to localstorage
 * <br>Doesn't restrict data
 * @todo Combine
 */
function loadReclyneDataQuick() {
    // Save data to localstorage
    for (let i = 0; i < keysLocal.length; i++) {
        updateLocalStorage(keysLocal[i], datasLocal[i]);
    }

    // Refresh table
    generateTable(false);
}

/**
 * Removes all keys from allStorage that aren't active in the dataToPort map
 * @param {string[]} keys - Array of keys from reclyne-data file
 * @param {string[]} datas - Array of data from reclyne-data file
 * @returns A single array of the keys and datas, and only the ones present in the dataToPort map
 */
function restrictAllStorage2(keys, datas) {
    let ret = [];
    for (let i = 0; i < keys.length; i++) {
        if (dataToPort.get(keys[i]) != false) {
            ret.push(new Array(keys[i], datas[i]));
        }
    }
    return ret;
}