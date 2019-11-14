/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/

export const StorageService = function() {
    this.saveToLocal = function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    this.saveToSession = function(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    this.getFromLocal = function(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    this.getFromSession = function(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }
}
