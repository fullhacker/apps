/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/

export class TimerService {

    constructor() {}

    initialize(el) {
        if (!el) return;

        this.display = el;
        this.currentTime = '0:00:00';
        this.updateDisplay();
    }

    start() {
        if (this.running || !this.display) return;

        // run timer
        this.running = true;
        this.updateDisplay();
    }

    stop() {

    }

    updateDisplay() {
        this.display.innerHTML = this.currentTime;
    }
}