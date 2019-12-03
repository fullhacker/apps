/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/
import{LoggerService}from"./logger.service.js";const INTERVAL=1;export class TimerService{constructor(){this.loggerService=new LoggerService}initialize(t){t&&(this.display=t,this.startTime=void 0,this.id&&this.stop(),this.updateDisplay())}start(){!this.running&&this.display&&(this.running=!0,this.startTime=(new Date).getTime(),this.id=window.setInterval(()=>this.updateDisplay(),INTERVAL),this.loggerService.debug(`started timer id: ${this.id}`))}stop(){return this.running=!1,clearInterval(this.id),this.loggerService.debug(`stopped timer id: ${this.id}`),this.id=void 0,this.time}updateDisplay(){let t=(new Date).getTime()-this.startTime;this.time=Math.floor(t/INTERVAL),this.display.innerHTML=this.pretty(this.time)||"0"}pretty(t){if(t){var i=parseInt(t%1e3/100),e=Math.floor(t/1e3%60),s=Math.floor(t/6e4%60),r=Math.floor(t/36e5%24);return r=r<10?`0${r}`:r,s=s<10?`0${s}`:s,e=e<10?`0${e}`:e,`${this.clean(r,":")}${this.clean(s,":")}${this.clean(e,".")}${this.clean(i,"")}`}}clean(t,i){return"00"===t?"":`${t}${i}`}};
