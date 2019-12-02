import { LoggerService } from "./logger.service.js";

/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/

const INTERVAL = 1;

export class TimerService {

    constructor() {
        this.loggerService = new LoggerService();
    }

    initialize(el) {
        if (!el) return;

        this.display = el;
        this.startTime = undefined;
        this.stop()
        this.updateDisplay();
    }

    start() {
        if (this.running || !this.display) return;

        // run timer
        this.running = true;
        this.startTime = new Date().getTime();
        this.id = window.setInterval(() => this.updateDisplay(), INTERVAL);
        this.loggerService.debug(`started timer id: ${this.id}`);
    }

    stop() {
        this.running = false;
        clearInterval(this.id);
        this.loggerService.debug(`stopped timer id: ${this.id}`);
        return this.time;
    }

    updateDisplay() {
        let currentTime = new Date().getTime() - this.startTime;
        this.time = Math.floor(currentTime / INTERVAL);
        this.display.innerHTML = this.pretty(this.time) || '0';
    }

    pretty(duration) {
        if (!duration) return undefined;
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        return `${this.clean(hours, ':')}${this.clean(minutes, ':')}${this.clean(seconds, '.')}${this.clean(milliseconds, '')}`;
    }

    clean(str, separator) {
        return (str === '00') ? '' : `${str}${separator}`;
    }
}

