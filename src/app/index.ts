import * as PIXI from "pixi.js";

import Game from "../game/Game";
import config from "../config/config";

const app = new PIXI.Application({
    width: config.game.gameWidth,
    height: config.game.gameHeight,
    backgroundColor: config.game.gameFont,
});
document.body.appendChild(app.view);

const loader = PIXI.Loader.shared;

loader
    .add("assets/png/card-1.png")
    .add("assets/png/card-2.png")
    .add("assets/png/card-3.png")
    .add("assets/png/card-4.png")
    .add("assets/png/card-5.png")
    .add("assets/png/card-6.png")
    .add("assets/png/card-7.png")
    .add("assets/png/card-8.png")
    .add("assets/png/card-back.png")
    .load((loader, resources) => {
        const game = new Game(app, resources);
        game.start();
    });
