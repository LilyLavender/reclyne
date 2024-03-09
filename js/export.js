

$('#exportDataButton').on('click', function() {
    showExportBox();
});

$('#exportclose').on('click', function() {
    hideExportBox();
});

$('#exportForm').on('submit', function(e) {
    e.preventDefault();
    saveReclyneData();
    hideExportBox();
});

function showExportBox() {
    // Clear all other boxes
    hideAllBoxes();
    //Populate box with proper data
    populateExportBox();
    // Visually show box
    exportbox.removeClass('hiddenTrans');
    // Show overlay
    overlay.removeClass('hidden');
}

function hideExportBox() {
    // Visually hide box
    exportbox.addClass('hiddenTrans');
    // Hide overlay
    overlay.addClass('hidden');
    // Unfocus input box
    //gotoinput.blur();
    // Clear input
    //gotoinput.val('');
}

function populateExportBox() {
    // Get array of keys

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
    
    // todo if no data

    // Sort allKeys array by month
    let allKeysSort = sortAllKeys(allKeys);

    // Add elements to html
    allKeysSort.forEach((element) => {
        console.log($('#exportline1'));
        $('#exportline1').appendChild(`<div id="${element}"></div>`);
    });
// not work, TODO

    const array1 = ['a', 'b', 'c'];
    array1.forEach((element) => console.log(element));
    
}

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
        /*|| keys[i].includes("reclyne")*/) {
            // Add key to first column & data to second
            allStorage.push([keys[i], localStorage.getItem(keys[i])]);
        }
    }
    
    // todo if no data

    // Sort allStorageArray by month
    let allStorageSort = sortAllStorage(allStorage);

    // Saves allStorageSort array to allStorageStr string
    let allStorageStr = "";
    for (i = 0; i < allStorageSort.length; i++) {
        allStorageStr += `${allStorageSort[i][0]} § ${allStorageSort[i][1]}`;
        if (i < allStorageSort.length - 1) {
            allStorageStr += `\n`;
        }
    }
    
    // Set file to download
    let blob = new Blob([allStorageStr], { type: "text/plain" });
    // Download recylne-data file
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = `reclyne-data-${getVerboseDateTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Sorts allStorage array by year, then month
function sortAllStorage(allStorage) {  
    allStorage.sort((a, b) => {
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

// Sorts allKeys array by year, then month
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

// Get current date & time in format yyyy-mm-dd-hh-mm-ss
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