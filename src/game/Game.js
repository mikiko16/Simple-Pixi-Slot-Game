import { gsap } from 'gsap';

import Card from './Card';
import config from '../config/config'

export default class Game {
    constructor(app, resources) {
        this.app = app;
        this.resources = resources;
        this.numPairs = config.game.numPairs;
        this.createCounterText()
        this.resetGameState()
        this.start();

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    start() {
        this.createCards();
    }

    createCounterText() {
        this.attemptsLeftText = new PIXI.Text(``, {
            fontSize: 30,
            fill: 'white',
            align: 'center',
        });

        this.attemptsLeftText.x = 20;
        this.attemptsLeftText.y = 20;
        this.updateCounterText()

        this.app.stage.addChild(this.attemptsLeftText);
    }

    updateCounterText(attemptsLeft = this.maxAttempts) {
        this.attemptsLeftText.text = `Attempts Left: ${attemptsLeft}`
    }

    createCards() {
        const cardTextures = [
            this.resources['assets/png/card-1.png'].texture,
            this.resources['assets/png/card-2.png'].texture,
            this.resources['assets/png/card-3.png'].texture,
            this.resources['assets/png/card-4.png'].texture,
            this.resources['assets/png/card-5.png'].texture,
            this.resources['assets/png/card-6.png'].texture,
            this.resources['assets/png/card-7.png'].texture,
            this.resources['assets/png/card-8.png'].texture,
        ].slice(0, this.numPairs);

        const cardTexturesWithPairs = this.shuffleArray([...cardTextures, ...cardTextures]);

        const numCols = Math.ceil(Math.sqrt(this.numPairs * 2));
        const numRows = Math.ceil((this.numPairs * 2) / numCols);

        const totalWidth = numCols * (config.card.cardWidth + config.card.padding);
        const totalHeight = numRows * (config.card.cardHeight + config.card.padding);

        const startX = (this.app.view.width - totalWidth) / 2 + config.card.cardWidth / 2;
        const startY = (this.app.view.height - totalHeight) / 2 + config.card.cardHeight / 2;

        let index = 0;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                if (index >= cardTexturesWithPairs.length) return;

                const cardTexture = cardTexturesWithPairs[index];
                const card = new Card(cardTexture, this.resources['assets/png/card-back.png'].texture, config.card.cardWidth, config.card.cardHeight);

                card.sprite.x = startX + col * (config.card.cardWidth + config.card.padding);
                card.sprite.y = startY + row * (config.card.cardHeight + config.card.padding);

                card.sprite.interactive = true;
                card.sprite.buttonMode = true;
                card.sprite.on('pointerdown', () => this.onCardClick(card));

                this.app.stage.addChild(card.sprite);
                this.cards.push(card);

                index++;
            }
        }
    }

    onCardClick(card) {
        if (this.selectedCards.length < 2 && 
            !this.selectedCards.includes(card) && 
            !card.isFlipped && 
            !this.isGameOver) {
            card.flip();
            this.selectedCards.push(card);

            if (this.selectedCards.length === 2) {
                this.checkForMatch();
            }
        }
    }

    checkForMatch() {
        const [card1, card2] = this.selectedCards;

        if (card1.frontTexture.textureCacheIds === card2.frontTexture.textureCacheIds) {
            this.pairsFound++;
            this.selectedCards = [];

            if (this.pairsFound === this.numPairs) {
                this.endGame("win");
                this.isGameOver = true
            }
        } else {
            gsap.delayedCall(1, () => {
                card1.flipBack();
                card2.flipBack();
                this.selectedCards = [];
            })
        }

        this.attempts++;
        this.updateCounterText(this.maxAttempts - this.attempts)
        this.checkGameOver();
    }

    checkGameOver() {
        if (this.attempts >= this.maxAttempts && this.pairsFound < this.numPairs) {
            this.endGame("lose");
            this.isGameOver = true
        }
    }

    endGame(result) {
        gsap.delayedCall(0.5, () => {
            this.showEndMessage(result);
        })
    }

    showEndMessage(result) {
        const message = result === "win" ? "YOU WIN !" : "YOU LOSE !";

        const text = new PIXI.Text(message, {
            fontSize: config.animation.textFont,
            fill: result === "win" ? config.animation.winTextColor : config.animation.loseTextColor,
            align: 'center',
        });

        text.x = this.app.view.width / 2 - text.width / 2;
        text.y = this.app.view.height / 2 - text.height / 2;

        this.app.stage.addChild(text);

        gsap.fromTo(text, {alpha: 0}, {alpha: 1, duration: config.animation.textAnimDuration, 
            onComplete: () => {
                this.app.stage.removeChild(text)
            }})
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    handleKeyDown(event) {
        if (event.code === 'Space' && this.isGameOver) {
            this.restartGame();
        }
    }

    restartGame() {
        this.resetGameState()
        this.createCards();
    }

    resetGameState() {
        this.cards = [];
        this.selectedCards = [];
        this.pairsFound = 0;
        this.maxAttempts = this.numPairs * 2;
        this.attempts = 0;
        this.isGameOver = false
        this.updateCounterText()
    }
}
