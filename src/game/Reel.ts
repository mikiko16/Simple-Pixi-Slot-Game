import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { SymbolFactory } from './SymbolFactory';

export class Reel {
    public container: PIXI.Container;
    private symbols: PIXI.Sprite[] = [];
    private isSpinning = false;
    private stopTime = 0;
    private factory: SymbolFactory;

    constructor(x: number, y: number, factory: SymbolFactory, count: number = 3) {
        this.container = new PIXI.Container();
        this.container.x = x;
        this.container.y = y;
        this.factory = factory;

        const mask = new PIXI.Graphics();
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 100, count * 110);
        mask.endFill();
        this.container.addChild(mask);
        this.container.mask = mask;

        for (let i = 0; i < count; i++) {
            const sprite = this.factory.create();
            sprite.y = i * 110;
            this.container.addChild(sprite);
            this.symbols.push(sprite);
        }
    }

    startSpinning(delay: number) {
        this.isSpinning = true;
        this.stopTime = Date.now() + delay;
    }

    update() {
        if (!this.isSpinning) return;

        for (const sprite of this.symbols) {
            sprite.y += 20;
            if (sprite.y > 330) {
                sprite.y = -100;
                const newSprite = this.factory.create();
                sprite.texture = newSprite.texture;
            }
        }

        if (Date.now() > this.stopTime) {
            this.isSpinning = false;
            this.realign();
        }
    }

    private realign() {
        this.symbols.forEach((sprite, index) => {
            gsap.to(sprite, {
                y: index * 110,
                duration: 0.4,
                ease: "bounce.out"
            });
        });
    }

    getTextures(): string[] {
        return this.symbols.map(sprite => sprite.texture.textureCacheIds[0]);
    }

    getSymbolAt(index: number): PIXI.Sprite {
        return this.symbols[index];
    }

    clearGlow() {
        this.symbols.forEach(sprite => (sprite.filters = []));
    }

    isDone(): boolean {
        return !this.isSpinning;
    }
}
