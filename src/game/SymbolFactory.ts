import * as PIXI from 'pixi.js';

export class SymbolFactory {
    private textures: PIXI.Texture[];

    constructor() {
        this.textures = [
            'assets/png/002.png',
            'assets/png/003.png',
            'assets/png/004.png',
            'assets/png/005.png',
            'assets/png/006.png',
            'assets/png/007.png',
            'assets/png/008.png',
            'assets/png/009.png',
            'assets/png/0010.png',
            'assets/png/011.png'
        ].map(path => PIXI.Texture.from(path));
    }

    create(): PIXI.Sprite {
        const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
        const sprite = new PIXI.Sprite(texture);
        sprite.width = 100;
        sprite.height = 100;
        return sprite;
    }
}
