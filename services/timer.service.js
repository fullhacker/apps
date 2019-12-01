/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/

const INTERVAL = 1;

export class TimerService {

    constructor() {}

    initialize(el) {
        if (!el) return;

        this.display = el;
        this.startTime = undefined;
        this.updateDisplay();
    }

    start() {
        if (this.running || !this.display) return;

        // run timer
        this.running = true;
        this.startTime = new Date().getTime();
        this.id = window.setInterval(() => this.updateDisplay(), INTERVAL);
    }

    stop() {
        this.running = false;
        clearInterval(this.id);
        this.updateDisplay();
    }

    updateDisplay() {
        let currentTime = new Date().getTime() - this.startTime;
        const time = Math.floor(currentTime / INTERVAL);
        this.display.innerHTML = msToTime(time) || 0;
    }
}

function msToTime(duration) {
    if (!duration) return undefined;
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}