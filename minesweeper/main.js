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
var testMode = false;
var grid = document.getElementById("grid");
var myMinesweeper = new Minesweeper(grid, testMode);

/** initialize the dialog service **/
const dialogService = new DialogService();
dialogService.initialize();

/** event handlers **/
// event for updating the difficulty level
window.updateSetting = function() {
    let settingField = document.createElement('select');
    settingField = document.getElementById('setting-field');
    const settingKey = settingField.options[settingField.selectedIndex].value;
    console.log('updating settings: ' + settingKey);
    myMinesweeper.updateSetting(settingKey);
}

// event for resetting the game
window.reset = function() {
 myMinesweeper.generateGrid();
}

// event for hiding the announcement
window.hideAnnouncement = function() {
    document.getElementById('message-modal').style.display = 'none';
}

/** start the game **/
myMinesweeper.generateGrid();
