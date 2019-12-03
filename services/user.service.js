/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/
export class UserService{constructor(){this.id||(this.browserId=this.generateId())}generateId(){var e=window.navigator,r=window.screen,t=e.mimeTypes.length;return t+=e.userAgent.replace(/\D+/g,""),t+=e.plugins.length,t+=r.height||"",t+=r.width||"",t+=r.pixelDepth||""}};
