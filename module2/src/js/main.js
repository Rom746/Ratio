import '../css/style.scss';
import { Game } from "./game.js";
import { Control } from "./game_control.js";
import { Grid } from "./game_grid.js";
import { GameStorage } from "./game_storage.js";
import { View } from "./game_view.js";

window.onload = () => {
    const size = 5; //1-5
    const view = new View(size);
    const control = new Control;
    const grid = new Grid(size);
    const storage = new GameStorage();
    const game = new Game(size, view, control, grid, storage).init();
}