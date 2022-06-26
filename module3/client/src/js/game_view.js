export function View(size) {
    this.size = size;
    this.init();
}

View.prototype.init = function () {

    this.createHTML();
    this.updateContainer();
}

View.prototype.createHTML = function () {
    this.HTML = {
        score: ".score__container",
        best: ".best__container",
        gameContainer: ".game__container",
        message: ".game__message",
        grid: ".game__grid",
        tiles: ".game__tiles",
        recordTable: ".record-table",
        form: ".game__form"
    };

    for (let key in this.HTML) {
        this.HTML[key] = document.querySelector(this.HTML[key]);
    }

    for (let i = 0; i < this.size * this.size; i++) {
        this.createElement(this.HTML.grid, "li", "grid__cell");
    }
}

View.prototype.updateContainer = function () {
    let gap = parseInt(getComputedStyle(this.HTML.grid).gap);
    this.width = document.querySelector(".grid__cell").offsetWidth + gap;
    if (this.size < 5) {
        this.HTML.grid.style.width = (this.size * this.getWidth() + 2) + "px";
    }
}

View.prototype.createElement = function (parent, tag, ...args) {
    let element = document.createElement(tag);
    element.setAttribute("class", args.join(" "));
    parent.appendChild(element);
    return element;
}

View.prototype.update = function (grid, data) {
    let self = this;

    window.requestAnimationFrame(() => {

        this.HTML.score.textContent = data.score;
        this.HTML.best.textContent = data.best;

        this.clearContainer(this.HTML.tiles);

        grid.forCells(function (cell, x, y) {
            if (cell) {
                self.addTile(cell, { x: x, y: y })
            }
        })

        if (data.over || data.win) {
            const keepBtn = document.querySelector(".button-keep");
            if (data.win) {
                document.querySelector(".message__btn").textContent = "New Game";
                document.querySelector(".message__text").textContent = "You win";
                keepBtn.style.display = "block";
            } else {
                document.querySelector(".message__btn").textContent = "Retry Game";
                document.querySelector(".message__text").textContent = "Game over";
                keepBtn.style.display = "none";
            }
            this.HTML.message.style.display = "block";
        } else {
            this.HTML.message.style.display = "none";
        }
    });



    if (this.size < 5) {
        this.HTML.grid.style.width = (this.size * this.getWidth() + 2) + "px";
    }
}

View.prototype.clearContainer = function (container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

View.prototype.addTile = function (cell, position) {
    let tile = document.createElement("li");
    let value = document.createElement("p");

    const setCoord = (element, position) => {
        element.style.left = ((position.x) * this.width) + "px";
        element.style.top = ((position.y) * this.width) + "px";
    }

    tile.classList.add("tiles__tile");

    let valueClass = `tile__value value-${String(cell.value).length}`;

    value.style.backgroundColor = this.getColor(cell.value);

    value.textContent = cell.value;

    if (cell.previousPosition) {
        setCoord(tile, cell.previousPosition);
        window.requestAnimationFrame(function () {
            setCoord(tile, position);
        });

    } else {
        if (cell.merged.length) {
            cell.merged.forEach((merged) => {
                this.addTile(merged, position);
            })
            valueClass += " value-merged";
        } else {
            valueClass += " value-new";
        }

        setCoord(tile, position);
    }

    value.setAttribute("class", valueClass);
    tile.appendChild(value);

    this.HTML.tiles.appendChild(tile);
}

View.prototype.getColor = function (value) {
    let color = {
        2: "#FFBEB7",
        4: "#FFA399",
        8: "#C65C50",
        16: "#A4E4CD",
        32: "#71BCA1",
        64: "#3B9273",
        128: "#FFF7B7",
        256: "#FFF399",
        512: "#C6B850",
        1024: "#FFE34C",
        2048: "#FFD700",
    }
    return color[value];
}

View.prototype.openRecord = function (arr) {

    this.HTML.gameContainer.classList.toggle("disable");
    this.HTML.recordTable.classList.toggle("disable");
    document.querySelector('.button-restart').classList.toggle("disable");

    const btnNext = document.querySelector('.button-next');
    btnNext.classList.toggle("disable");

    if (!arr) { return; }

    this.ind = 0;

    const createTable = () => {

        const title = document.querySelector('.record-table__title');
        const list = document.querySelector('.record-table__list');

        const btnText = ['World record', 'World infinity', 'Your record', 'Your infinity'];

        const nextInd = this.ind == arr.length - 1 ? 0 : this.ind + 1;

        btnNext.textContent = btnText[nextInd];
        title.textContent = btnText[this.ind] + ' table';

        const createRow = (obj) => {
            const li = this.createElement(list, 'li', 'record-table__item');
            for (const key in obj) {
                if (key == '_id') { continue; }
                const p = this.createElement(li, 'p', 'record-table__text');
                p.textContent = obj[key];
            }
        }

        this.clearContainer(list);
        let titleRow = {};

        for (const key in arr[this.ind][0]) {
            titleRow[key] = key.charAt(0).toUpperCase() + key.slice(1);
        }

        createRow(titleRow);
        arr[this.ind].forEach(obj => { createRow(obj) });

        this.ind = nextInd;
    }

    createTable();

    if (this.btnEvent) { return; }

    btnNext.addEventListener('click', () => { createTable(); });

    this.btnEvent = true;
}

View.prototype.openForm = async function (func) {

    let input = document.querySelector('.form__input');
    let btn = document.querySelector('.form__button');
    let error = document.querySelector('.form__error');

    const errorTxt = ['Selected name is taken', 'Write name']

    btn.addEventListener('click', async () => {
        if (input.value == '') {
            error.classList.toggle("disable");
            error.textContent = errorTxt[1];
            return ;
        }

        let res = await func(input.value);

        if (res) {
            error.classList.toggle("disable");
            error.textContent = errorTxt[0];
        } else {
            this.HTML.form.classList.toggle("disable");
            return ;
        }
    });

    input.addEventListener('click', () => {error.classList.toggle("disable");})

    this.HTML.form.classList.toggle("disable");
}