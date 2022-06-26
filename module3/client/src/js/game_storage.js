import { ServerAPI } from "./server_API.js";

export function GameStorage () {
    this.local = window.localStorage;
    this.server = new ServerAPI();
    this.MAX_RECORD = 10;
   
}

GameStorage.prototype.updateLocalStorage = function (key, value) {
    const sub = 'game_2048_' + key;
    if (value) {
        this.local.setItem(sub, JSON.stringify(value));
        return value;
    }
    return JSON.parse(this.local.getItem(sub));
}

GameStorage.prototype.best = function (value) {
    return this.updateLocalStorage('best-score', value) || 0;
}

GameStorage.prototype.recordTable = async function (value, key) {
    const sub = key ? 'record/infinity' : 'record';

    if (value) {
        await this.server.post(sub, Object.assign({ username: this.username}, value));
        return ;
    }

    const res = await this.server.get(sub);
    const table = res instanceof Error ? [] : res;

    return this.sort(table);
}

GameStorage.prototype.recordLocalTable = function (value, key) {
    const sub = key ? 'record-infinity' : 'record';
    let table = this.updateLocalStorage(sub) || [];
    if (value) {
        table.push(Object.assign({ played: this.countGame}, value));
        this.sort(table);
        if (table.length > this.MAX_RECORD) { table.pop(); }
        this.updateLocalStorage(sub, table);
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
    this.countGame = this.updateLocalStorage('countGame') || 0;
    this.updateLocalStorage('countGame', this.countGame + 1);
    this.startTime = false;
    this.time();
}

GameStorage.prototype.name = function (value) {
    this.username = this.updateLocalStorage('userName', value);
    return this.username;
}

GameStorage.prototype.checkName = async function (username) {
    return await this.server.post('name', {username});
}