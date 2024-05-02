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
        this.error = $(`#${shortName}-error`);
        this.line2 = $(`#${shortName}-line-2`);
        this.navButtons = $(`#${shortName}-buttons`);
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
        // Allows toggling of a PortBox item on and off when clicked 
        this.line2.on('click', `div[class^="${shortName}-cont-"]`, (e) => {
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
                this.buttonSubmit.addClass('inactive');
            } else {
                this.buttonSubmit.removeClass('inactive');
            }
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
}