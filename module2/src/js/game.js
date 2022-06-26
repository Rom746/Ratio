export function Game(size, view, control, grid, storage) {
    this.size = size;
    this.initialCells = 2;
    this.view = view;
    this.control = control.init(this);
    this.grid = grid;
    this.storage = storage;
}

Game.prototype.init = function () {
    this.score = 0;
    this.best = this.storage.best();
    this.gameOver = false;
    this.gameWin = false;
    this.gameInfinity = false;
    this.stop = false;
    this.grid.init();
    this.storage.init(this);
    this.createInitialCells();
    // this.setTestGrid();
    this.update();
}

Game.prototype.setTestGrid = function () {
    let emptyCells = this.grid.getEmptyCells();
    if (emptyCells.length) {
        let value = 1024;
        let r = Math.floor(Math.random() * emptyCells.length);
        let cell = emptyCells[r];
        let cell2 = emptyCells[r + 1];
        this.grid.setCell(cell, value);
        this.grid.setCell(cell2, value);
    }
}

Game.prototype.createInitialCells = function () {
    for (let i = 0; i < this.initialCells; i++) {
        this.generateNewCell();
    }
}
Game.prototype.generateNewCell = function () {
    let emptyCells = this.grid.getEmptyCells();
    if (emptyCells.length) {
        let value = Math.random() < 0.9 ? 2 : 4;
        let cell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
        this.grid.setCell(cell, value);
    }
    if (emptyCells.length == 1) {
        this.gameOver = !this.checkGameOver();
    }
}

Game.prototype.update = function () {
    if (this.score > this.best) {
        this.best = this.storage.best(this.score);
    }

    if (this.gameWin) {
        const time = this.storage.time();
        this.storage.recordTable({ time: time });
    }

    if (this.gameInfinity && this.gameOver) {
        const time = this.storage.time();
        this.storage.recordTable({ time: time, score: this.score }, true);
    }

    this.view.update(this.grid, {
        score: this.score,
        best: this.best,
        over: this.gameOver,
        win: this.gameWin
    });
}



Game.prototype.move = function (data) {
    let moved = false;

    if (this.gameOver) return;

    this.grid.updatePosition();

    for (let i = 0; i < this.size; i++) {

        let row = this.grid.getRow(i, data);

        let result;

        if (data == "Down" || data == "Right") {
            result = this.moveRow(row.reverse());
            result.row.reverse();
        }
        else {
            result = this.moveRow(row);
        }

        this.grid.setRow(i, result.row, data)
        moved = moved || result.moved;
    }

    if (moved) {
        this.generateNewCell()
        this.update();
    }

}

Game.prototype.moveRow = function (oldRow) {

    let moved;
    let tmpRow = [];
    let newRow = [];
    let q = 0;

    for (let i = 0; i < this.size; i++) {
        if (oldRow[i] != 0) {
            if (q != i) {
                moved = true;
            }
            tmpRow[q] = oldRow[i];
            q++;
        }
    }

    for (let i = q; i < this.size; i++) {
        tmpRow[i] = 0;
    }

    q = 0;
    let i = 0;
    while (i < this.size) {
        if ((i + 1 < this.size) && (tmpRow[i].value == tmpRow[i + 1].value) && tmpRow[i] != 0) {
            moved = true;
            newRow[q] = tmpRow[i + 1];
            newRow[q].merged = [{
                value: tmpRow[i].value,
                previousPosition: tmpRow[i].previousPosition,
            }, {
                value: tmpRow[i + 1].value,
                previousPosition: tmpRow[i + 1].previousPosition,
            }
            ];
            newRow[q].previousPosition = null;
            newRow[q].value *= 2;
            this.score += newRow[q].value;
            if (!this.gameInfinity && newRow[q].value == 2048) {
                this.gameWin = true;
            };
            i++;
        } else {
            newRow[q] = tmpRow[i];
        }
        q++;
        i++;
    }
    for (let j = q; j < this.size; j++) {
        newRow[j] = 0;
    }
    return { row: newRow, moved: moved };
}

Game.prototype.checkGameOver = function () {
    let self = this;

    for (let i = 0; i < this.size; i++) {
        if (check(this.grid.getRow(i, "Up")) || check(this.grid.getRow(i, "Left"))) {
            return true;
        }
    }
    return false;

    function check(row) {
        let q = 0;
        let i = 0;

        while (i < self.size - 1) {
            if (row[i].value == row[i + 1].value) {
                return true;
            }
            q++;
            i++;
        }
        return false;
    }
}

Game.prototype.input = function (event, data) {
    switch (event) {
        case 'restart':
            this.init();
            break;

        case 'resize':
            this.view.updateContainer();
            this.update();
            break;

        case 'keep':
            this.gameWin = false;
            this.gameInfinity = true;
            this.update();
            break;

        case 'record':
            this.openRecordTable();
            break;

        case 'test':
            this.gameOver = true;
            this.update()
            break;

        default:
            if (this.gameWin || this.gameOver || this.pause) return;
            this.move(data);
            break;
    }
}

Game.prototype.openRecordTable = function () {

    if (this.pause) {
        this.view.openRecord();
        this.pause = false;
        return;
    }

    const record = this.storage.recordTable();
    const recordI = this.storage.recordTable(false, true);

    this.view.openRecord([record, recordI]);
    this.pause = true;
}