let keysLocal = [];
let datasLocal = [];
let allKeysLocal = []; // todo deduce necessity of this

var importDataTimer;

class ImportBox extends PortBox {
    /**
     * The ImportBox. Handles importing data into reclyne
     * @class
     */
    constructor() {
        super('import-data-box', 'import');
        
        // Event listeners
        // Show import box when import nav button is clicked
        this.dataButton.on('click', () => {
            if (importDataTimer) clearTimeout(importDataTimer);
            importDataTimer = setTimeout(() => { 
                this.loadReclyneData(false);
            }, dblclickDelay);  
        });
        // Quick import when import nav button is double-clicked
        this.dataButton.on('dblclick', () => {
            clearTimeout(importDataTimer);
            this.loadReclyneData(true);
        });
        // Imports select data from reclyne data file when the "import data" button in the import box is clicked
        this.buttonSubmit.on('click', () => {
            // Makes sure button is active
            if (!$(this).hasClass('inactive')) {
                // Only if data was saved, hide the import box
                if (this.loadReclyneData2()) { this.hide(); }
            }
        });
    }

    // Methods
    /**
     * Populates the import box with all month-day keys from reclyne-data file
     */
    populate() {
        // Get all data from imported file
        let allKeys = allKeysLocal;

        // If no data, display error
        if (allKeys.length == 0) {
            // Hide form
            this.form.hide();
            // Show error p
            this.error.show();
            this.error.html('No data was found in file');
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

        // Remove duplicate keys
        let allKeysFinal = [...new Set(allKeysSort)];

        //Clear html
        this.line2.html('');
        // Add elements to html
        allKeysFinal.forEach((element) => {
            let eleParts = element.split('-');
            eleParts[0] = eleParts[0].charAt(0).toUpperCase() + eleParts[0].slice(1);
            this.line2.append(`<div class="import-cont-${element}"><p class="import-p-${element}" data-key="${element}">${eleParts[0]} ${eleParts[1]}</p></div>`);
            dataToPort.set(element, true);
        });
        let numItems = this.line2.children().length;
        let gridSize = Math.ceil(Math.sqrt(numItems));
        if (gridSize > maxGridSize) { gridSize = maxGridSize; }
        this.line2.css('grid-template-columns', `repeat(${gridSize}, 1fr)`);
    }

    /**
     * Pulls up the file upload option for the user to import their reclyne-data file
     * @param {bool} quickImport - Quick import - whether or not to display the import box
     */
    loadReclyneData(quickImport) {
        // Upload reclyne-data file
        let d = document.createElement("input");
        d.setAttribute('type', 'file');
        d.setAttribute('id', 'fileinput');
        document.body.appendChild(d);
        d.addEventListener('change', () => {
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
                    let lineParts = linesO[i].split(' § ');
                    if (lineParts[1] !== undefined) {
                        // Save split lines to keys and datas array
                        keys.push(lineParts[0]);
                        datas.push(JSON.parse(lineParts[1]));
                    } else {
                        // Currently only here to test an elusive error
                        console.groupCollapsed(`Error parsing file at line ${i+1}`);
                        console.log(linesO[i]);
                        console.groupEnd();
                    }
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
                    this.show();
                }

                // Save keys and datas to local variants
                keysLocal = keys;
                datasLocal = datas;

                if (quickImport) {
                    this.loadReclyneDataQuick();
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
    loadReclyneData2() {
        // Restrict data to store
        let restrictedData = this.restrictAllStorage2(keysLocal, datasLocal);

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
    loadReclyneDataQuick() {
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
    restrictAllStorage2(keys, datas) {
        let ret = [];
        for (let i = 0; i < keys.length; i++) {
            if (dataToPort.get(keys[i]) != false) {
                ret.push(new Array(keys[i], datas[i]));
            }
        }
        return ret;
    }

}