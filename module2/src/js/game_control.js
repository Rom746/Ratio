export function Control() { }

Control.prototype.init = function (self) {

    const moveEvent = () => {
        const map = {
            38: "Up",
            39: "Right",
            40: "Down",
            37: "Left",
            87: "Up",
            68: "Right",
            83: "Down",
            65: "Left"
        };

        document.addEventListener("keydown", function (event) {
            if (map[event.keyCode]) {
                event.preventDefault();
                self.input("move", map[event.keyCode])
            }
            if (event.which === 82) {
                self.input("restart");
            }
        });
    };

    const buttonEvent = () => {
        const btnRestart = document.querySelectorAll(".button-restart");
        const btnKeepPlay = document.querySelector(".button-keep");
        const aboveScore = document.querySelector(".above__score");
        const btnTest = document.querySelector('.test');

        btnRestart.forEach((btn) =>
            btn.addEventListener("click", () => self.input("restart")));
        btnKeepPlay.addEventListener("click", () => self.input("keep"));
        aboveScore.addEventListener("click", () => self.input("record"));

        btnTest.addEventListener("click", () => self.input("test"));
    }

    const touchEvent = () => {
        const regexp = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i;
        const gameContainer = document.querySelector(".game__container");
        let moveStartX, moveStartY;

        const start = (event) => {
            moveStartX = event.clientX;
            moveStartY = event.clientY;
        }

        const end = (event) => {
            let moveEndX = event.clientX;
            let moveEndY = event.clientY;

            var dx = moveEndX - moveStartX;
            var dy = moveEndY - moveStartY;

            var absDx = Math.abs(dx);
            var absDy = Math.abs(dy);

            if (Math.max(absDx, absDy) > 10) {
                self.input("move", absDx > absDy ? (dx > 0 ? "Right" : "Left") : (dy > 0 ? "Down" : "Up"));
            }
        }

        gameContainer.ondragstart = () => { return false; };

        if (regexp.test(window.navigator.userAgent)) {

            gameContainer.addEventListener("touchstart", (event) => { start(event.touches[0]); });
            gameContainer.addEventListener("touchend", function (event) { end(event.changedTouches[0]) });

        } else {
            gameContainer.addEventListener("mousedown", (event) => { start(event); });
            gameContainer.addEventListener("mouseup", function (event) { end(event) });
        }
    }

    const windowEvent = () => {
        let timeOut = null;

        window.onresize = () => {
            if (timeOut != null)
                clearTimeout(timeOut);

            timeOut = setTimeout(function () {
                self.input("resize");
            }, 100);
        };
    }

    moveEvent();
    buttonEvent();
    touchEvent();
    windowEvent();
}