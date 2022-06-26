export function GameStorage () {
    this.storage = window.localStorage;
    this.MAX_RECORD = 10;
}

GameStorage.prototype.update = function (key, value) { 
    const sub = 'game_2048_' + key;
    if (value) {
        this.storage.setItem(sub, JSON.stringify(value));
        return value;
    }
    return JSON.parse(this.storage.getItem(sub));
}

GameStorage.prototype.best = function (value) {
    return this.update('best-score', value) || 0;
}

GameStorage.prototype.recordTable = function (value, key) {
    const sub = key ? 'record-infinity' : 'record';
    let table = this.update(sub) || [];
    if (value) {
        table.push(Object.assign({ played: this.countGame}, value));
        this.sort(table);
        if (table.length > this.MAX_RECORD) { table.pop(); }
        this.update(sub, table);
    } 
    return table;
}

GameStorage.prototype.time = function () {
    const time = new Date();
    if (!this.startTime) {
        this.startTime = time;
        return;
    }
    return time - this.startTime;
}

GameStorage.prototype.sort = function (arr) {
    return arr.sort((a, b) => {
        if (a.time > b.time) {
            return 1;
        }
        if (a.time < b.time) {
            return -1;
        }
        return 0;
    });
}

GameStorage.prototype.init = function () {
    this.countGame = this.update('countGame') || 0;
    this.update('countGame', this.countGame + 1);
    this.startTime = false;
    this.time();
}