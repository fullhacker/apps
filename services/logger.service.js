/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/

export class LoggerService {
    debug(message, data) {
        if (typeof message === 'string') {
            if (data) {
                console.log(message, data);
            } else {
                console.log(message);
            }
        } else {
            console.warn(`LoggerService.debug expects a string as first parameter but got a ${typeof message}`, message);
        }
    }
}