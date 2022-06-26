export function Grid(size) {
    this.size = size;
}

Grid.prototype.init = function () {
    this.cells = [];
    for (let i = 0; i < this.size; i++) {
        this.cells[i] = [];
        for (let j = 0; j < this.size; j++) {
            this.cells[i].push(0);
        }
    }
}

Grid.prototype.getEmptyCells = function () {
    let cells = [];
    this.forCells(function(cell, i, j) {
        if (!cell) {
            cells.push({ x: i, y: j })
        }
    });
    return cells;
}

Grid.prototype.setCell = function (cell, value) {
    this.cells[cell.x][cell.y] = {
        value: value,
        previousPosition: null,
        merged: []
    };
}

Grid.prototype.getRow = function (ind, data) {
    if (data == "Up" || data == "Down") {
        return this.cells[ind];
    } else {
        let row = [];
        for (let i = 0; i < this.size; i++) {
            row[i] = this.cells[i][ind];
        }
        return row;
    }
}

Grid.prototype.setRow = function (ind, row, data) {
    if (data == "Up" || data == "Down") {
        this.cells[ind] = row;
    } else {
        for (let i = 0; i < this.size; i++) {
            this.cells[i][ind] = row[i];
        }
    }
}

Grid.prototype.updatePosition = function () {
    this.forCells(function(cell, i, j) {
        if (cell) {
            cell.previousPosition = {x: i, y: j};
            cell.merged = [];
        }
    });
}

Grid.prototype.forCells = function (callback) {
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            callback(this.cells[i][j], i, j);
        }
    }
}