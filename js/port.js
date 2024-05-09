const dataToPort = new Map();
const dblclickDelay = 200;
const maxGridSize = 9;

class PortBox extends DisplayBox {
    /**
     * Blueprint for import/export classes. Abstract
     * @param {string} id - The ID for the portbox, ie "import-data-box"
     * @param {string} shortName - The short name for the portbox, ie "import"
     * @class
     * @abstract Must be overridden
     */
    constructor(id, shortName) {
        super(id, shortName);
        // Properties
        this.form = $(`#${shortName}-form`);
        this.error = $(`#${id} .port-error`);
        this.line2 = $(`#${id} .port-line-2`);
        this.navButtons = $(`#${id} .port-buttons`);
        this.buttonSubmit = $(`#${shortName}-button-submit`);
        this.dataButton = $(`#${shortName}-data-button`);

        // Event listeners
        $(`#${shortName}-button-cancel`).on('click', () => this.hide()); // Close PortBox when clicking the cancel button
        // Selects everything/nothing to be selected when the all/none buttons are clicked
        $(`#${shortName}-button-all`).on('click', () => {
            [...dataToPort.keys()].forEach((key) => dataToPort.set(key, true));
            [this.line2.children()].forEach((child) => child.children().removeClass('inactive'));
            this.buttonSubmit.removeClass('inactive');
        });
        $(`#${shortName}-button-none`).on('click', () => {
            [...dataToPort.keys()].forEach((key) => dataToPort.set(key, false));
            [this.line2.children()].forEach((child) => child.children().addClass('inactive'));
            this.buttonSubmit.addClass('inactive');
        });
    }
    
    // Overrides
    showHelper() {
        // Populate portbox
        this.populate();
        // Super
        super.showHelper();
    }

    hideHelper() {
        // Super
        super.hideHelper();
        // Clear dataToPort map
        dataToPort.clear();
    }

    // Methods
    /**
     * Sorts allKeys array by year, then month
     * <br>Sorts in chronological order, ie jan-2024 comes before apr-2024
     * @param {string[]} allKeys - Array of keys from localstorage
     * @returns allkeys, sorted
     * @todo This might not be needed, if we get rid of allStorage completely in favor of allKeys
     */
    sortAllKeys(allKeys) {  
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
     * Adds elements to port-line-2 and binds event listeners
     * @param {string[]} allKeys
     */
    populateHelper(allKeys) {
        //Clear html
        this.line2.html('');
        // Add elements to html
        allKeys.forEach((element) => {
            let eleParts = element.split('-');
            // Split month and year pairs from keys
            eleParts[0] = eleParts[0].charAt(0).toUpperCase() + eleParts[0].slice(1);
            // Create portCont element
            let portCont = $(`<div class="${this.shortName}-cont-${element}"><p class="${this.shortName}-p-${element}" data-key="${element}">${eleParts[0]} ${eleParts[1]}</p></div>`);
            // Bind event listener
            portCont.on('click', () => {
                // Set value of key on click
                if (dataToPort.get(element)) {
                    portCont.children().addClass('inactive');
                    dataToPort.set(element, false);
                } else {
                    portCont.children().removeClass('inactive');
                    dataToPort.set(element, true);
                }
                
                // Grey out submit button if every value is false
                if (dataToPort.values().every((v) => v === false)) {
                    this.buttonSubmit.addClass('inactive');
                } else {
                    this.buttonSubmit.removeClass('inactive');
                }
            });
            // Add portCont to port-line-2
            this.line2.append(portCont);
            // Set key to true in dataToPort
            dataToPort.set(element, true);
        });
        // Set grid CSS
        let numItems = this.line2.children().length;
        let gridSize = Math.ceil(Math.sqrt(numItems));
        if (gridSize > maxGridSize) { gridSize = maxGridSize; }
        this.line2.css('grid-template-columns', `repeat(${gridSize}, 1fr)`);
    }
}