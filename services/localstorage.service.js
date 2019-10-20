export const LocalStorageService = function() {
    this.saveToLocalStorage = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    this.getFromLocalStorage = function(key) {
        return JSON.parse(localStorage.getItem(key));
    }
}