/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/
export class LoggerService{debug(e,o){"string"==typeof e?o?console.log(e,o):console.log(e):console.warn(`LoggerService.debug expects a string as first parameter but got a ${typeof e}`,e)}};
