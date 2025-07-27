import * as PIXI from 'pixi.js';
import { SlotMachine } from '../game/SlotMachine';

window.onload = () => {
    const app = new PIXI.Application({
        width: 480,
        height: 640,
        backgroundColor: 0x1099bb
    });

    document.body.appendChild(app.view as HTMLCanvasElement);   

    const game = new SlotMachine(app);
    app.ticker.add(() => game.update());
};