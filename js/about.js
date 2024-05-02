class AboutBox extends DisplayBox {
    /**
     * AboutBox that displays information about reclyne & its shortcuts
     * @class
     */
    constructor() {
        super('about-box', 'about');

        // Event listeners
        $('#about-button').on('click', () => this.toggle());
    }
}