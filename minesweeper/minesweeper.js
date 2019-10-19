/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/

export const Minesweeper = function(_grid, testMode = false) {
    let grid = document.createElement('table');
    let flagsCountDisplay = document.createElement('span');
    flagsCountDisplay = document.getElementById('flags-count');
    grid = _grid;
    const _this = this;
    let callBackArray = [
        clickCell,
        middleClickCell,
        rightClickCell
    ];
    let firstClick = true;
    let isBusy = false;
    const levels = {
        beginner: {
            rows: 9,
            cols: 9,
            mines: 10
        },
        intermediate: {
            rows: 16,
            cols: 16,
            mines: 40
        },
        expert: {
            rows: 16,
            cols: 30,
            mines: 99
        },
        nightmare: {
            rows: 20,
            cols: 30,
            mines: 150
        }
    }

    let setting = levels.beginner;
    let flagsCount = setting.mines;

    this.updateSetting = function(key){
        setting = levels[key];
        this.generateGrid();
    }

    this.generateGrid = function() {
        //generate 10 by 10 grid
        firstClick = true;
        grid.innerHTML="";
        grid.oncontextmenu = () => false;
        flagsCount = setting.mines;
        for (let i = 0; i < setting.rows; i++) {
            let row = grid.insertRow(i);
            row.oncontextmenu = () => false;
            for (let j=0; j<setting.cols; j++) {
                let cell = row.insertCell(j);
                initializeEventHandlers(cell);

                let dataCol = document.createAttribute('data-col');
                dataCol.value = '' + j;
                cell.setAttributeNode(dataCol)

                let dataRow = document.createAttribute('data-row');
                dataRow.value = '' + i;
                cell.setAttributeNode(dataRow)

                let mine = document.createAttribute("data-mine");       
                mine.value = "false";             
                cell.setAttributeNode(mine);

                let status = document.createAttribute("data-status");       
                status.value = "default";             
                cell.setAttributeNode(status);
            }
        }

        let gameStatus = document.createAttribute('game-status');
        gameStatus.value = 'inactive';
        grid.setAttributeNode(gameStatus);

        updateFlagsCountDisplay();
        addMines(setting.mines);
    }

    function setBusy() {
        isBusy = true;
        setTimeout(() => isBusy = false, 500);
    }

    function updateFlagsCountDisplay(count = flagsCount) {
        flagsCountDisplay.innerHTML = count;
    }

    function initializeEventHandlers(cell) {
        cell.onmouseup = function(e) {        // Set grid status to active on first click
            if (!isBusy && typeof e === 'object' && e.button != '2') {
                callBackArray[e.button].call(_this, this);
                setBusy();
            }
        }
        cell.onmousedown = function(e) {
            if (!isBusy && typeof e === 'object' && e.button == '2') {
                callBackArray[e.button].call(_this, this);
                setBusy();
            }
        }
        cell.oncontextmenu = () => false;
        cell.onselectstart = () => false;
        cell.setAttribute('unselectable', 'on');
    }

    function addMines(minesCount) {
        //Add mines randomly
        for (let i=0; i<minesCount; i++) {
            let row = Math.floor(Math.random() * setting.rows);
            let col = Math.floor(Math.random() * setting.cols);
            let cell = grid.rows[row].cells[col];
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
        for (let i=0; i<setting.rows; i++) {
            for(let j=0; j<setting.cols; j++) {
                let cell = grid.rows[i].cells[j];
                const win = grid.getAttribute('game-status') == 'win';
                if (win) {
                    handleWinRevelation(cell);
                } else {
                    handleLostRevelation(cell);
                }
            }
        }
    }

    function handleWinRevelation(cell) {
        updateFlagsCountDisplay(0);
        if (isMine(cell)) {
            cell.innerHTML = ':)'
            cell.className = 'correct';
            setStatus(cell, 'clicked');
            let correct = document.createAttribute('title');
            correct.value = 'Correct';
            cell.setAttributeNode(correct)
            setStatus(cell, 'clicked');
        }
    }

    function handleLostRevelation(cell) {
        if (isFlagged(cell)) {
            cell.className = 'flag'
            if (!isMine(cell)) {
                cell.innerHTML = 'X'
                cell.className = 'wrong';
                let wrong = document.createAttribute('title');
                wrong.value = 'Wrong';
                cell.setAttributeNode(wrong);
            } else {
                cell.innerHTML = ':)'
                cell.className = 'correct';
                let correct = document.createAttribute('title');
                correct.value = 'Correct';
                cell.setAttributeNode(correct);
            }
        } else {
            if (isMine(cell)) {
                cell.className = 'mine';
                setStatus(cell, 'clicked');
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
        let levelComplete = true;
            for (let i=0; i<setting.rows; i++) {
            for(let j=0; j<setting.cols; j++) {
                if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") && (grid.rows[i].cells[j].innerHTML=="")) levelComplete=false;
            }
        }
        if (levelComplete && grid.getAttribute('game-status') == 'active') {
            // alert("You Win!");
            grid.setAttribute('game-status', 'win');
            revealMines();
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
        if (grid.getAttribute('game-status') != 'active' || getStatus(cell) !== 'clicked') {
            return;
        }
        // check for number of surrounding flags
        let cellValue = parseInt(cell.innerHTML, 10);
        let flagCount = countFlagsAround(cell);

        if (flagCount === cellValue) {
            clickSurrounding(cell);
            console.log('middle click', cell);
        }
    }

    function countFlagsAround(cell) {
        let flagCount = 0;
        let cellRow = cell.parentNode.rowIndex;
        let cellCol = cell.cellIndex;
        for (let i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1, setting.rows - 1); i++) {
            for(let j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1, setting.cols - 1); j++) {
                if (isFlagged(grid.rows[i].cells[j])) flagCount++;
            }
        }
        return flagCount;
    }

    function clickSurrounding(cell) {
        let cellRow = cell.parentNode.rowIndex;
        let cellCol = cell.cellIndex;
        for (let i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1, setting.rows - 1); i++) {
            for(let j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1, setting.cols - 1); j++) {
                let currentCell = grid.rows[i].cells[j];
                if (getStatus(currentCell) == 'flagged') continue;
                openCell(currentCell);
            }
        }
    }

    function increaseFlagsCount() {
        flagsCount++;
        updateFlagsCountDisplay();
    }

    function decreaseFlagsCount() {
        flagsCount--;
        updateFlagsCountDisplay();
    }

    function rightClickCell(cell) {
        if (grid.getAttribute('game-status') == 'inactive') {
            grid.setAttribute('game-status', 'active');
        }
        if (grid.getAttribute('game-status') != 'active') return;
        if (getStatus(cell) != 'clicked' && getStatus(cell) != 'empty') {
            if (getStatus(cell) == 'default') {
                if (flagsCount <= 0) return;
                cell.className = 'flag';
                decreaseFlagsCount();
                setStatus(cell, 'flagged');
            } else {
                cell.className = '';
                increaseFlagsCount();
                setStatus(cell, 'default');
            }
            console.log('right click', cell);
        }
    }

    function clickCell(cell) {
        if (grid.getAttribute('game-status') == 'inactive') {
            grid.setAttribute('game-status', 'active');
        }
        if (grid.getAttribute('game-status') != 'active') return;
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

        openCell(cell);
    }

    function printMines() {
        let count = 0;
        for (let i = 0; i < setting.rows; i++) {
            for (let j = 0; j < setting.cols; j++) {
                if (isMine(grid.rows[i].cells[j])) console.log(count++ + ' - mine: [' + i + ',' + j + ']');
            }
        }
    }

    function transferMine(cell = undefined) {
        let found = false;
        do {
            let row = Math.floor(Math.random() * setting.rows);
            let col = Math.floor(Math.random() * setting.cols);
            const transferMineToCell = grid.rows[row].cells[col];
            if (isMine(transferMineToCell) || isNeighbor(cell, transferMineToCell)) {
                continue;
            } else {
                transferMineToCell.setAttribute('data-mine', 'true');
                if (testMode){
                    transferMineToCell.innerHTML = 'X';
                    console.log('transferred mine to: ' + row + ', ' + col);
                }
                found = true;
                return;
            }
        } while(!found)
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
        let mineCount=0;
        let cellRow = cell.parentNode.rowIndex;
        let cellCol = cell.cellIndex;
        // alert(cellRow + " " + cellCol);
        for (let i = Math.max(cellRow-1,0); i <= Math.min(cellRow+1,setting.rows-1); i++) {
            const rows = grid.rows[i];
            if (!rows) continue;
            for(let j = Math.max(cellCol-1,0); j <= Math.min(cellCol+1,setting.cols-1); j++) {
                const cell = rows.cells[j]; 
                if (cell && isMine(cell)) {
                    mineCount++;
                }
            }
        }
        return mineCount;
    }

    function handleEmpty(cell) {
        cell.innerHTML = ' ';
        cell.className = 'empty';
        let cellRow = cell.parentNode.rowIndex;
        let cellCol = cell.cellIndex;
        setStatus(cell, 'empty');
        //Reveal all adjacent cells as they do not have a mine
        for (let y = Math.max(cellRow-1,0); y <= Math.min(cellRow+1, setting.rows - 1); y++) {
            const rows = grid.rows[y];
            if (!rows) continue;
            for(let x = Math.max(cellCol-1,0); x <= Math.min(cellCol+1, setting.cols - 1); x++) {
                //Recursive Call
                const cell = rows.cells[x];
                if (cell && !isOpen(cell)) {
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
            // alert("Game Over");
            grid.setAttribute('game-status', 'over');
        } else {
            const mineCount = countMinesAround(cell);
            if (mineCount==0) { 
                handleEmpty(cell);
            } else {
                cell.innerHTML = mineCount;
                const dataValue = document.createAttribute('data-value');
                dataValue.value = mineCount;
                cell.setAttributeNode(dataValue);
            }
            //Count and display the number of adjacent mines
            checkLevelCompletion();
        }
    }
}