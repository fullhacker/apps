/*
 initial code was a  challenge from:
 minesweeper game by 101computing.net - www.101computing.et/minesweeper-in-javascript/
*/

var testMode = false; //Turn this variable to true to see where the mines are
var grid = document.createElement('table'); // to declare varible grid as type HTMLTableElement and get proper intellisense
grid = document.getElementById("grid");
generateGrid();

function generateGrid() {
    //generate 10 by 10 grid
    grid.innerHTML="";
    for (var i=0; i<10; i++) {
        var row = grid.insertRow(i);
        for (var j=0; j<10; j++) {
            var cell = row.insertCell(j);
            cell.onmouseup = function(e) {
                // console.log(e);

                // Set grid status to active on first click
                if (grid.getAttribute('game-status') == 'inactive') {
                    grid.setAttribute('game-status', 'active');
                }

                if (typeof e === 'object' && grid.getAttribute('game-status') == 'active') {
                    switch (e.button) {
                        case 0: clickCell(this); break;
                        case 1: middleClickCell(this); break;
                        case 2: rightClickCell(this); break;
                        default: console.error('What click was that???', e);
                    }
                }
            }
            cell.oncontextmenu = () => false;
            var mine = document.createAttribute("data-mine");       
            mine.value = "false";             
            cell.setAttributeNode(mine);

            var flagged = document.createAttribute("data-status");       
            flagged.value = "default";             
            cell.setAttributeNode(flagged);
        }
    }

    var gameStatus = document.createAttribute('game-status');
    gameStatus.value = 'inactive';
    grid.setAttributeNode(gameStatus);

    addMines();
}

function addMines() {
    //Add mines randomly
    for (var i=0; i<20; i++) {
        var row = Math.floor(Math.random() * 10);
        var col = Math.floor(Math.random() * 10);
        var cell = grid.rows[row].cells[col];
        cell.setAttribute("data-mine","true");
        if (testMode) cell.innerHTML="X";
    }
}

function revealMines(win) {
    //Highlight all mines in red
    for (var i=0; i<10; i++) {
        for(var j=0; j<10; j++) {
            var cell = grid.rows[i].cells[j];
            if (isMine(cell)) {
                cell.className= win ? 'flag' : 'mine';
            }
            if (isFlagged(cell)) {
                if (!isMine(cell)) {
                    cell.innerHTML = 'X'
                    cell.className = 'wrong';
                    var wrong = document.createAttribute('title');
                    wrong.value = 'Wrong';
                    cell.setAttributeNode(wrong);
                } else {
                    cell.innerHTML = ':)'
                    cell.className = 'correct';
                    var correct = document.createAttribute('title');
                    correct.value = 'Correct';
                    cell.setAttributeNode(correct);
                }
            }
        }
    }

    grid.setAttribute('game-status', win ? 'win' : 'over');
}

function isFlagged(cell) {
    return getStatus(cell) == 'flagged';
}

function isMine(cell) {
    return cell.getAttribute('data-mine') == 'true';
}

function checkLevelCompletion() {
    var levelComplete = true;
        for (var i=0; i<10; i++) {
        for(var j=0; j<10; j++) {
            if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") && (grid.rows[i].cells[j].innerHTML=="")) levelComplete=false;
        }
    }
    if (levelComplete && grid.getAttribute('game-status') == 'active') {
        alert("You Win!");
        revealMines(true);
    }
}

function setStatus(cell, status) {
    cell.setAttribute('data-status', status);
}

function getStatus(cell) {
    return cell.getAttribute('data-status');
}

function middleClickCell(cell) {
    // check for number of surrounding flags
    var flagCount = 0;
    var cellRow = cell.parentNode.rowIndex;
    var cellCol = cell.cellIndex;
    for (var i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1,9); i++) {
        for(var j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1,9); j++) {
            if (isFlagged(grid.rows[i].cells[j])) flagCount++;
        }
    }
    var cellValue = parseInt(cell.innerHTML, 10);

    if (getStatus(cell) === 'clicked' && flagCount === cellValue) {
        clickSurrounding(cell);
        console.log('middle click', cell);
    }
}

function clickSurrounding(cell) {
    var cellRow = cell.parentNode.rowIndex;
    var cellCol = cell.cellIndex;
    for (var i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1,9); i++) {
        for(var j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1,9); j++) {
            // if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
            clickCell(grid.rows[i].cells[j]);
        }
    }
}

function rightClickCell(cell) {
    if (getStatus(cell) != 'clicked' && getStatus(cell) != 'empty') {
        if (getStatus(cell) == 'default') {
            cell.className = 'flag';
            setStatus(cell, 'flagged');
        } else {
            cell.className = '';
            setStatus(cell, 'default');
        }
        console.log('right click', cell);
    }
}

function clickCell(cell) {
    //Check if the end-user clicked on a mine
    if (getStatus(cell) == 'flagged') {
        return;
    } else if (cell.getAttribute("data-mine")=="true") {
        revealMines();
        alert("Game Over");
    } else {
            cell.className="clicked";
            setStatus(cell, 'clicked');
            
            //Count and display the number of adjacent mines
            var mineCount=0;
            var cellRow = cell.parentNode.rowIndex;
            var cellCol = cell.cellIndex;
            //alert(cellRow + " " + cellCol);
            for (var i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1,9); i++) {
                for(var j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1,9); j++) {
                    if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
                }
            }
            if (mineCount==0) { 
                cell.innerHTML = 0;
                cell.className = 'empty';
                setStatus(cell, 'empty');
                //Reveal all adjacent cells as they do not have a mine
                for (var y = Math.max(cellRow-1,0); y <= Math.min(cellRow+1,9); y++) {
                    for(var x = Math.max(cellCol-1,0); x <= Math.min(cellCol+1,9); x++) {
                        //Recursive Call
                        if (grid.rows[y].cells[x].innerHTML == "") {
                            clickCell(grid.rows[y].cells[x]);
                        }
                    }
                }
            } else {
                cell.innerHTML = mineCount;
            }
        checkLevelCompletion();
    }
}
