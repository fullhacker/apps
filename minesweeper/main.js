import { Minesweeper } from './minesweeper.js';

var testMode = false; //Turn this variable to true to see where the mines are
var grid = document.createElement('table'); // to declare varible grid as type HTMLTableElement and get proper intellisense
grid = document.getElementById("grid");
var myMinesweeper = new Minesweeper(grid, testMode);
window.updateSetting = function() {
    let settingField = document.createElement('select');
    settingField = document.getElementById('settingField');
    const settingKey = settingField.options[settingField.selectedIndex].value;
    console.log('updating settings: ' + settingKey);
    myMinesweeper.updateSetting(settingKey);
}
window.reset = function() {
 myMinesweeper.generateGrid();
}
window.hideAnnouncement = function() {
    document.getElementById('message-modal').style.display = 'none';
}
myMinesweeper.generateGrid();