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
                console.log(e);
                if (typeof e === 'object') {
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

            var flagged = document.createAttribute("data-flagged");       
            flagged.value = "false";             
            cell.setAttributeNode(flagged);
        }
    }
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

function revealMines() {
    //Highlight all mines in red
    for (var i=0; i<10; i++) {
    for(var j=0; j<10; j++) {
        var cell = grid.rows[i].cells[j];
        if (cell.getAttribute("data-mine")=="true") cell.className="mine";
    }
    }
}

function checkLevelCompletion() {
    var levelComplete = true;
        for (var i=0; i<10; i++) {
        for(var j=0; j<10; j++) {
            if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") && (grid.rows[i].cells[j].innerHTML=="")) levelComplete=false;
        }
    }
    if (levelComplete) {
        alert("You Win!");
        revealMines();
    }
}

function middleClickCell(cell) {
    console.log('middle click', cell);
}

function rightClickCell(cell) {
    if (cell.getAttribute('data-flagged')=="false") {
        cell.className = 'flag';
        cell.setAttribute('data-flagged', 'true');
    } else {
        cell.className = '';
        cell.setAttribute('data-flagged', 'false');
    }

    console.log('right click', cell);
}

function clickCell(cell) {
    //Check if the end-user clicked on a mine
    if (cell.getAttribute('data-flagged')=="true") {
        return;
    } else if (cell.getAttribute("data-mine")=="true") {
        revealMines();
        alert("Game Over");
    } else {
            cell.className="clicked";
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
            cell.innerHTML = mineCount;
            if (mineCount==0) { 
                //Reveal all adjacent cells as they do not have a mine
                for (var y = Math.max(cellRow-1,0); y <= Math.min(cellRow+1,9); y++) {
                    for(var x = Math.max(cellCol-1,0); x <= Math.min(cellCol+1,9); x++) {
                        //Recursive Call
                        if (grid.rows[y].cells[x].innerHTML == "") {
                            clickCell(grid.rows[y].cells[x]);
                        }
                    }
                }
            }
        checkLevelCompletion();
    }
}
