import * as utils from '../utils/utilities.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');

        this.gridSize = 32;
        this.snakeSpeed = 150;
        this.lastMoveTime = 0;

    }
    /*------------------------------------------------Main functions/*------------------------------------------------*/
    /**
     * Preload assets for the game.
     * @return {void}
     */
    create() {
        this.cameras.main.setZoom(1.048)
        // Initialize game variables
        this.score = 0;
        this.scoreText = this.add.text(30, 30, 'score: ' + this.score, { fontSize: '32px', fill: '#fff' });
        this.isGameOver = false;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.cameras.main.setBackgroundColor(0x000000);
        this.size = this.cameras.main.width;

        // Create the snake and initialize its size
        utils.createSnake(this);

        // Create tutorial text 
        utils.tutorialText(this);

        // Spawn initial food
        utils.spawnFood(this);

        // Setup keyboard and swipe controls
        utils.setupControls(this);
    }

    /**
     * Update the game state.
     * @param {number} time - The current time in milliseconds.
     * @returns 
     */
    update(time) {
        // Check if the game is over
        if (this.isGameOver) return;

        // Handle keyboard input
        utils.keyboardHandler(this);

        // Move snake at fixed intervals according to the time
        if (time >= this.lastMoveTime + this.snakeSpeed) {
            utils.moveSnake(this);
            this.lastMoveTime = time;
        }
    }
}