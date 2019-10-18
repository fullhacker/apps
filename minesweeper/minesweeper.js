/*
 initial code was a  challenge from:
 minesweeper game by 101computing.net - www.101computing.et/minesweeper-in-javascript/
*/

export const Minesweeper = function(_grid, testMode = false) {
    var grid = document.createElement('table');
    grid = _grid;
    const _this = this;
    var callBackArray = [
        clickCell,
        middleClickCell,
        rightClickCell
    ];
    var firstClick = true;

    this.generateGrid = function() {
        //generate 10 by 10 grid
        firstClick = true;
        grid.innerHTML="";
        for (var i=0; i<10; i++) {
            var row = grid.insertRow(i);
            for (var j=0; j<10; j++) {
                var cell = row.insertCell(j);
                initializeEventHandlers(cell);

                var dataCol = document.createAttribute('data-col');
                dataCol.value = '' + j;
                cell.setAttributeNode(dataCol)

                var dataRow = document.createAttribute('data-row');
                dataRow.value = '' + i;
                cell.setAttributeNode(dataRow)

                var mine = document.createAttribute("data-mine");       
                mine.value = "false";             
                cell.setAttributeNode(mine);

                var status = document.createAttribute("data-status");       
                status.value = "default";             
                cell.setAttributeNode(status);
            }
        }

        var gameStatus = document.createAttribute('game-status');
        gameStatus.value = 'inactive';
        grid.setAttributeNode(gameStatus);

        addMines();
    }

    function initializeEventHandlers(cell) {
        cell.onmouseup = function(e) {        // Set grid status to active on first click

            if (typeof e === 'object') {
                callBackArray[e.button].call(_this, this);
            }
        }
        cell.oncontextmenu = () => false;
    }

    function addMines() {
        //Add mines randomly
        for (var i=0; i<20; i++) {
            var row = Math.floor(Math.random() * 10);
            var col = Math.floor(Math.random() * 10);
            var cell = grid.rows[row].cells[col];
            if (isMine(cell)) {
                transferMine();
            } else {
                cell.setAttribute("data-mine","true");
            }
            if (testMode){
                cell.innerHTML = 'X';
            }
        }
        if (testMode) {
            printMines();
        }
    }

    function revealMines() {
        //Highlight all mines in red
        for (var i=0; i<10; i++) {
            for(var j=0; j<10; j++) {
                var cell = grid.rows[i].cells[j];
                if (isMine(cell)) {
                    cell.className= 'mine';
                }
                handleCellRevelation(cell);
            }
        }
    }

    function handleCellRevelation(cell) {
        if (isFlagged(cell)) {
            cell.className = 'flag'
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

    function isOpen(cell) {
        return cell.innerHTML !== '' && !isFlagged(cell);
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
            revealMines();
            grid.setAttribute('game-status', 'win');
        }
    }

    function setStatus(cell, status) {
        cell.setAttribute('data-status', status);
    }

    function getCol(cell) {
        return cell.getAttribute('data-col');
    }

    function getRow(cell) {
        return cell.getAttribute('data-row');
    }

    function getStatus(cell) {
        if (!cell) return undefined;
        return cell.getAttribute('data-status');
    }

    function middleClickCell(cell) {
        if (getStatus(cell) !== 'clicked') {
            return;
        }
        // check for number of surrounding flags
        var cellValue = parseInt(cell.innerHTML, 10);
        var flagCount = countFlagsAround(cell);

        if (flagCount === cellValue) {
            clickSurrounding(cell);
            console.log('middle click', cell);
        }
    }

    function countFlagsAround(cell) {
        var flagCount = 0;
        var cellRow = cell.parentNode.rowIndex;
        var cellCol = cell.cellIndex;
        for (var i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1,9); i++) {
            for(var j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1,9); j++) {
                if (isFlagged(grid.rows[i].cells[j])) flagCount++;
            }
        }
        return flagCount;
    }

    function clickSurrounding(cell) {
        var cellRow = cell.parentNode.rowIndex;
        var cellCol = cell.cellIndex;
        for (var i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1,9); i++) {
            for(var j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1,9); j++) {
                var currentCell = grid.rows[i].cells[j];
                if (getStatus(currentCell) == 'flagged') continue;
                openCell(currentCell);
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
        if (grid.getAttribute('game-status') == 'inactive') {
            grid.setAttribute('game-status', 'active');
        }

        //Check if the end-user clicked on a mine
        console.log('click', cell);
        if (getStatus(cell) == 'flagged' || grid.getAttribute('game-status') == 'over') {
            return;
        } else if (getStatus(cell) == 'clicked') {
            middleClickCell(cell);
            return
        } else if (isMine(cell) && firstClick) {
            cell.setAttribute('data-mine', 'false');
            transferMine(cell);
            printMines();
        }

        openCell(cell, firstClick);
    }

    function printMines() {
        var count = 0;
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                if (isMine(grid.rows[i].cells[j])) console.log(count++ + ' - mine: [' + i + ',' + j + ']');
            }
        }
    }

    function transferMine(cell = undefined) {
        for (var i = 0; i < 100; i++) {
            var row = Math.floor(Math.random() * 10);
            var col = Math.floor(Math.random() * 10);
            const transferMineToCell = grid.rows[row].cells[col];
            if (isMine(transferMineToCell) || isNeighbor(cell, transferMineToCell)) {
                continue;
            } else {
                transferMineToCell.setAttribute('data-mine', 'true');
                if (testMode){
                    transferMineToCell.innerHTML = 'X';
                    console.log('transferred mine to: ' + row + ', ' + col);
                }
                return;
            }
        }
    }

    function isNeighbor(cell, nextCell) {
        if (cell === undefined) {
            return;
        }
        const rowDifference = Math.abs(getRow(cell) - getRow(nextCell));
        const colDifference = Math.abs(getCol(cell) - getCol(nextCell));

        return (rowDifference === 1) && (colDifference === 1);
    }

    function countMinesAround(cell) {
        var mineCount=0;
        var cellRow = cell.parentNode.rowIndex;
        var cellCol = cell.cellIndex;
        //alert(cellRow + " " + cellCol);
        for (var i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1,9); i++) {
            for(var j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1,9); j++) {
                if (isMine(grid.rows[i].cells[j])) {
                    mineCount++;
                }
            }
        }
        return mineCount;
    }

    function handleEmpty(cell) {
        cell.innerHTML = 0;
        cell.className = 'empty';
        var cellRow = cell.parentNode.rowIndex;
        var cellCol = cell.cellIndex;
        setStatus(cell, 'empty');
        //Reveal all adjacent cells as they do not have a mine
        for (var y = Math.max(cellRow-1,0); y <= Math.min(cellRow+1,9); y++) {
            for(var x = Math.max(cellCol-1,0); x <= Math.min(cellCol+1,9); x++) {
                //Recursive Call
                const cell = grid.rows[y].cells[x];
                if (!isOpen(cell)) {
                    clickCell(cell);
                }
            }
        }
    }

    function openCell(cell) {
        cell.className="clicked";
        setStatus(cell, 'clicked');
        firstClick = false;

        if (cell.getAttribute("data-mine")=="true") {
            revealMines();
            alert("Game Over");
            grid.setAttribute('game-status', 'over');
        } else {
            const mineCount = countMinesAround(cell);
            if (mineCount==0) { 
                handleEmpty(cell);
            } else {
                cell.innerHTML = mineCount;
            }
            //Count and display the number of adjacent mines
            checkLevelCompletion();
        }
    }
}