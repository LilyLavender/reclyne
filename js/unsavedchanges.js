class ChangesBox extends DisplayBox {
    /**
     * Unsaved Changes Box that prompts the user to save, discard, or cancel changes
     * @class
     */
    constructor() {
        super('unsaved-changes-box', 'changes');
        
        // Properties
        this.deferred = null;

        // Event listeners
        $('#changes-button-save').on('click', () => this.saveChanges() );
        $('#changes-button-cancel').on('click', () => this.cancelChanges() );
        this.closeButton.on('click', () => this.cancelChanges() );
    }

    /**
     * Waits for the user to click the save, cancel, or close button
     * @returns this.deferred.promise()
     */
    waitForUserAction() {
        this.deferred = $.Deferred();
        return this.deferred.promise();
    }

    /**
     * Saves changes by providing a ret value to trySaveFromCalendarToStorage()
     */
    saveChanges() {
        if (this.deferred) {
            saveFromCalendarToStorage();
            this.hide();
            this.deferred.resolve(true);
        }
    }

    /**
     * Cancels changes by providing a ret value to trySaveFromCalendarToStorage()
     */
    cancelChanges() {
        if (this.deferred) {
            this.hide();
            this.deferred.resolve(false);
        }
    }
}

/**
 * Pulls up unsaved changes dialogue when leaving reclyne
 * @param {event} e
 */
function beforeUnload(e) {
    e.preventDefault();
};

