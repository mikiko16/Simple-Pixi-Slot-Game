import * as PIXI from 'pixi.js';
import config from '../config/config'

export default class Card {
    constructor(frontTexture, backTexture) {
        this.frontTexture = frontTexture;
        this.backTexture = backTexture;

        this.sprite = new PIXI.Sprite(this.backTexture);
        this.sprite.anchor.set(0.5);
        this.sprite.width = config.card.cardWidth;
        this.sprite.height = config.card.cardHeight;
        this.isFlipped = false;
    }

    flip() {
        if (!this.isFlipped) {
            this.sprite.texture = this.frontTexture;
            this.isFlipped = true;
        }
    }

    flipBack() {
        if (this.isFlipped) {
            this.sprite.texture = this.backTexture;
            this.isFlipped = false;
        }
    }
}
