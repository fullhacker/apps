/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/

import { Minesweeper } from './minesweeper.js';
import { DialogService } from '../services/dialog.service.js';

/** app config variables **/
//Turn this variable to true to see where the mines are
var myMinesweeper = new Minesweeper((time, status) => console.log(time, status));

/** initialize the dialog service **/
const dialogService = new DialogService();
dialogService.initialize();


// event for hiding the announcement
window.hideAnnouncement = function() {
    document.getElementById('message-modal').style.display = 'none';
}

/** start the game **/
myMinesweeper.initialize();
