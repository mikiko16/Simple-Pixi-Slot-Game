import * as PIXI from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow';
import { Reel } from './Reel';
import { SymbolFactory } from './SymbolFactory';

export class SlotMachine {
    private app: PIXI.Application;
    private reels: Reel[] = [];
    private spinButton: PIXI.Sprite;
    private isSpinning = false;

    private balance: number = 100;
    private lastWin: number = 0;
    private balanceText: PIXI.Text;
    private winText: PIXI.Text;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.setup();
    }

    update() {
        if (!this.isSpinning) return;

        this.reels.forEach(reel => reel.update());

        const allStopped = this.reels.every(r => r.isDone?.());
        if (allStopped) {
            this.isSpinning = false;
            this.checkWins();
        }
    }

    private setup() {
        const background = PIXI.Sprite.from('assets/png/Poseidon-05.jpg');
        background.width = this.app.screen.width;
        background.height = this.app.screen.height;
        this.app.stage.addChild(background);

        const factory = new SymbolFactory();

        const reelXStart = 90;
        const reelSpacing = 110;

        for (let i = 0; i < 3; i++) {
            const reel = new Reel(reelXStart + i * reelSpacing, 100, factory, 3);
            this.app.stage.addChild(reel.container);
            this.reels.push(reel);
        }

        this.spinButton = PIXI.Sprite.from('assets/png/SpinButton.png');
        this.spinButton.anchor.set(0.5);
        this.spinButton.x = this.app.screen.width / 2;
        this.spinButton.y = this.app.screen.height - 60;
        this.spinButton.width = 100;
        this.spinButton.height = 50;
        this.spinButton.interactive = true;
        this.spinButton.buttonMode = true;
        this.spinButton.on('pointerdown', () => this.startSpin());
        this.app.stage.addChild(this.spinButton);

        this.balanceText = new PIXI.Text(`Credits: ${this.balance}`, { fontSize: 22, fill: 0xffffff });
        this.balanceText.x = 20;
        this.balanceText.y = 20;
        this.app.stage.addChild(this.balanceText);

        this.winText = new PIXI.Text(`Win: ${this.lastWin}`, { fontSize: 22, fill: 0xffff00 });
        this.winText.x = 20;
        this.winText.y = 50;
        this.app.stage.addChild(this.winText);


        this.app.ticker.add(() => this.update());
    }

    private startSpin() {
        if (this.isSpinning || this.balance <= 0) return;

        this.isSpinning = true;
        this.balance -= 1;
        this.lastWin = 0;
        this.updateUI();

        this.reels.forEach(reel => reel.clearGlow());

        this.reels.forEach((reel, i) => {
            const delay = 1000 + i * 600;
            reel.startSpinning(delay);
        });
    }

    private checkWins() {
        const matrix = this.getResultMatrix();
        let won = 0;

        for (let row = 0; row < 3; row++) {
            const a = matrix[0][row];
            const b = matrix[1][row];
            const c = matrix[2][row];
            if (a === b && b === c) {
               for (let col = 0; col < 3; col++) {
                const sprite = this.reels[col].getSymbolAt(row);
                sprite.filters = [new GlowFilter({ color: 0xffff00, outerStrength: 4 })];
            }
        }
    }

        this.lastWin = won;
        this.balance += won;
        this.updateUI();
    }

    private getResultMatrix(): string[][] {
        return this.reels.map(reel => reel.getTextures());
    }

    private updateUI() {
        this.balanceText.text = `Credits: ${this.balance}`;
        this.winText.text = `Win: ${this.lastWin}`;
    }
}
