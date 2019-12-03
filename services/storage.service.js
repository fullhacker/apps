/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/
export class StorageService{constructor(){}saveToLocal(e,t){localStorage.setItem(e,JSON.stringify(t))}saveToSession(e,t){sessionStorage.setItem(e,JSON.stringify(t))}getFromLocal(e){const t=localStorage.getItem(e);if("undefined"!==t)return JSON.parse(t)}getFromSession(e){const t=sessionStorage.getItem(e);if("undefined"!==t)return JSON.parse(t)}};
