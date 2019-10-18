import { Minesweeper } from './minesweeper.js';

var testMode = false; //Turn this variable to true to see where the mines are
var grid = document.createElement('table'); // to declare varible grid as type HTMLTableElement and get proper intellisense
grid = document.getElementById("grid");
var myMinesweeper = new Minesweeper(grid, testMode);
window.reset = function() {
 myMinesweeper.generateGrid();
}
window.hideAnnouncement = function() {
    document.getElementById('announcement-wrapper').style.display = 'none';
}
myMinesweeper.generateGrid();