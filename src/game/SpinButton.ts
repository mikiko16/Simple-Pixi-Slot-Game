import * as PIXI from 'pixi.js';

export class SpinButton {
    public container: PIXI.Sprite;

    constructor(x: number, y: number, onClick: () => void) {
        this.container = PIXI.Sprite.from('assets/png/SpinButton.png');
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.anchor.set(0.5);
        this.container.x = x;
        this.container.y = y;
        this.container.width = 120;
        this.container.height = 50;
        this.container.on('pointerdown', onClick);
    }
}
