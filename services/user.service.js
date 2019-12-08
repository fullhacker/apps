export class UserService {
    constructor() {
        if (!this.id) {
            this.browserId = this.generateId();
        }
    }

    generateId() {

        var nav = window.navigator;
        var screen = window.screen;
        var guid = nav.mimeTypes.length;
        guid += nav.userAgent.replace(/\D+/g, '');
        guid += nav.plugins.length;
        guid += screen.height || '';
        guid += screen.width || '';
        guid += screen.pixelDepth || '';

        return guid;
    }
}