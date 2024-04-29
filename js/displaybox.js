const GOTO_BOX = 0;
const GOTO_SYNTAX_BOX = 1;
const IMPORT_BOX = 2;
const EXPORT_BOX = 3;

// Hides all boxes when an active box is clicked off of. Overlay is shown when a box is activated
overlay.on('click', function() {
    hideAllBoxes();
});

/**
 * Hides every displaybox.
 */
function hideAllBoxes() {
    displayboxes.forEach((box) => box.hide());
}

/**
 * Creates one of each type of displaybox.
 * <br>Needs to be updated when a new type of displaybox is added
 */
function createDisplayBoxes() {
    displayboxes.push(new GotoBox(), new SyntaxBox(), new ImportBox(), new ExportBox());
}

class DisplayBox {
    /**
     * A basic displaybox. Allows for exclusively hiding and showing
     * @param {string} id - The ID for the displaybox, ie "goto-box"
     * @param {string} shortName - The short name for the displaybox, ie "goto"
     * @class
     * @abstract Must be overridden
     */
    constructor(id, shortName) {
        // Properties
        this.element = $(`#${id}`);
        this.closeButton = $(`#${shortName}-nav .bi-x-lg`);
        this.shown = false;
        
        // Event listeners
        this.closeButton.on('click', () => this.hide()); // Close displaybox when X button is clicked
    }
    
    // Getters & setters
    set setShown(value) {
        this.shown = value;
    }

    get isShown() {
        return this.shown;
    }

    // Methods
    show() {
        if (!this.isShown) {
            // Clear all other boxes
            hideAllBoxes();
            // Visually show box
            this.element.removeClass('hidden-trans');
            // Show overlay
            overlay.removeClass('hidden');
            // Update shown prop
            this.setShown = true;
        }
    }
    
    hide() {
        if (this.isShown) {
            // Visually hide box
            this.element.addClass('hidden-trans');
            // Hide overlay
            overlay.addClass('hidden');
            // Update shown prop
            this.setShown = false;
        }
    }
}