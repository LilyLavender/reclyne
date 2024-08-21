var exportDataTimer;

/**
 * Downloads a file with the given content and name
 * @param {string} fileContent - The content within the file
 * @param {string} fileName - The name of the file
 */
function downloadFile(fileContent, fileName) {
    let blob = new Blob([fileContent], { type: "text/plain" });
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

class ExportBox extends PortBox {
    /**
     * The ExportBox. Handles exporting data from localstorage
     * @class
     */
    constructor() {
        super('export-data-box', 'export');
        
        // Event listeners
        // Show export box when export nav button is clicked
        this.dataButton.on('click', () => {
            if (exportDataTimer) clearTimeout(exportDataTimer);
            exportDataTimer = setTimeout(() => { 
                this.show();
            }, dblclickDelay);  
        });
        // Immediately exports all data in reclyne when export nav button is double-clicked
        this.dataButton.on('dblclick', () => {
            clearTimeout(exportDataTimer);
            this.saveReclyneData();
        });
        // Exports select data in reclyne when the "export data" button in the export box is clicked
        this.buttonSubmit.on('click', () => {
            // Makes sure button is active
            if (!$(this).hasClass('inactive')) {
                // Only if data was saved, hide the export box
                if (this.saveReclyneData()) this.hide();
            }
        });
    }

    // Methods
    /**
     * Fills the export box with all "month-year" data found in localstorage
     */
    populate() {
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
            this.form.hide();
            // Show error p
            this.error.show();
            this.error.html('No data in reclyne! Try adding something first');
            // End function
            return;
        } else {
            // Show form
            this.form.show();
            // Hide error p
            this.error.hide();
        }

        // If only one item, remove all and none buttons
        if (allKeys.length == 1) {
            // Hide buttons
            this.navButtons.hide();
        } else {
            // Show buttons
            this.navButtons.show();
        }

        // Sort allKeys array by month
        let allKeysSort = this.sortAllKeys(allKeys);

        // Add elements to html
        this.populateHelper(allKeysSort);
    }

    /**
     * Creates reclyne-data file and downloads it
     * @returns True if data was successfully saved, error message as a string otherwise
     */
    saveReclyneData() {
        let allStorage = getAllReclyneData();

        // Don't export if there's no data
        // (this function can't actually run usually if there's no data, since the form would be hidden)
        // (exists purely for debugging)
        if (allStorage.length == 0) {
            return 'No data in reclyne! Try adding something first';
        }

        // Restrict allStorage array to only the active keys
        let allStorageRestricted = this.restrictAllStorage(allStorage);

        // Sort allStorage array by month
        let allStorageSort = this.sortAllStorage(allStorageRestricted);

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
     * Sorts allStorage array by year, then month
     * <br>Sorts in chronological order, ie jan-2024 comes before apr-2024
     * @param {string[]} allStorage - Array of key and data pairs from localstorage
     * @returns allStorage, sorted
     */
    sortAllStorage(allStorage) {  
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
    restrictAllStorage(allStorage) {
        let ret = [];
        allStorage.forEach(element => {
            if (dataToPort.get(element[0]) != false) {
                ret.push(element);
            }
        });
        return ret;
    }

}

/**
 * Gets all key-value pairs from localStorage
 * @returns allStorage array
 */
function getAllReclyneData() {
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
    
    return allStorage;
}