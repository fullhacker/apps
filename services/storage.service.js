/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/

export class StorageService {

    constructor() {
    }
    
    saveToLocal(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    saveToSession(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    getFromLocal(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    getFromSession(key) {
        return JSON.parse(sessionStorage.getItem(key));
    }
}
