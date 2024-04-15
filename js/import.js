const importline2 = $('#importline2');
const dataToImport = new Map();
let keysLocal = [];
let datasLocal = [];
let allKeysLocal = [];

var importDataTimer;
const importDataButton = $('#importDataButton');

// Normal import
importDataButton.on('click', function(e) {
    if (importDataTimer) clearTimeout(importDataTimer);
    importDataTimer = setTimeout(function() { 
        loadReclyneData(false);
    }, 200);  
});

// Quick import
importDataButton.on('dblclick', function(e) {
    clearTimeout(importDataTimer);
    loadReclyneData(true);
});

$('#importclose').on('click', function() {
    hideImportBox();
});

$('#importButtonSubmit').on('click', function() {
    // Makes sure button is active
    if (!$(this).hasClass('inactive')) {
        // Only if data was saved, hide the import box
        if (loadReclyneData2()) { hideImportBox(); }
    }
});

$('#importButtonCancel').on('click', function() {
    hideImportBox();
});

$('#importButtonAll').on('click', function() {
    [...dataToImport.keys()].forEach((key) => dataToImport.set(key, true));
    [importline2.children()].forEach((child) => child.children().removeClass('inactive'));
    $('#importButtonSubmit').removeClass('inactive');
});

$('#importButtonNone').on('click', function() {
    [...dataToImport.keys()].forEach((key) => dataToImport.set(key, false));
    [importline2.children()].forEach((child) => child.children().addClass('inactive'));
    $('#importButtonSubmit').addClass('inactive');
});

function showImportBox() {
    // Clear all other boxes
    hideAllBoxes();
    // Populate box with proper data
    populateImportBox();
    // Visually show box
    importbox.removeClass('hiddenTrans');
    // Show overlay
    overlay.removeClass('hidden');
}

function hideImportBox() {
    // Visually hide box
    importbox.addClass('hiddenTrans');
    // Hide overlay
    overlay.addClass('hidden');
    // Clear dataToImport map
    dataToImport.clear();
}

function populateImportBox() {
    // Get all data from imported file
    let allKeys = allKeysLocal;

    // If no data, display error
    if (allKeys.length == 0) {
        // Hide form
        $('#importForm').hide();
        // Show error p
        $('#importError').show();
        $('#importError').html('No data was found in file');
        // End function
        return;
    } else {
        // Show form
        $('#importForm').show();
        // Hide error p
        $('#importError').hide();
    }

    // If only one item, remove all and none buttons
    if (allKeys.length == 1) {
        // Hide buttons
        $('#importButtons').hide();
    } else {
        // Show buttons
        $('#importButtons').show();
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
        dataToImport.set(element, true);
    });
    let numItems = importline2.children().length;
    let gridSize = Math.ceil(Math.sqrt(numItems));
    if (gridSize > maxGridSize) { gridSize = maxGridSize; }
    importline2.css('grid-template-columns', `repeat(${gridSize}, 1fr)`);
}

importline2.on('click', 'div[class^="import-cont-"]', function(e) {
    // Set value of key on click
    let tar = $(e.target);
    let key = tar.data("key");
    if (dataToImport.get(key)) {
        tar.addClass('inactive');
        dataToImport.set(key, false);
    } else {
        tar.removeClass('inactive');
        dataToImport.set(key, true);
    }
    
    // Grey out submit button if every value is false
    if (dataToImport.values().every((v) => v === false)) {
        $('#importButtonSubmit').addClass('inactive');
    } else {
        $('#importButtonSubmit').removeClass('inactive');
    }
});

// Import data
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

// todo optimize combine
function loadReclyneDataQuick() {
    // Save data to localstorage
    for (let i = 0; i < keysLocal.length; i++) {
        updateLocalStorage(keysLocal[i], datasLocal[i]);
    }

    // Refresh table
    generateTable(false);
}

// Removes all keys from allStorage that aren't active in the dataToImport map
function restrictAllStorage2(keys, datas) {
    let ret = [];
    for (let i = 0; i < keys.length; i++) {
        if (dataToImport.get(keys[i]) != false) {
            ret.push(new Array(keys[i], datas[i]));
        }
    }
    return ret;
}