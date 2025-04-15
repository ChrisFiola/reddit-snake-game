import * as utils from '../utils/utilities.js';
import * as controls from '../utils/controls.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');

        this.gridSize = 60;
        this.snakeSpeed = 120;
        this.lastMoveTime = 0;

    }
    /*------------------------------------------------Main functions/*------------------------------------------------*/
    /**
     * Preload assets for the game.
     * @return {void}
     */
    create() {
        // Create a black rectangle for the game area
        this.add.rectangle(this.sys.game.canvas.width/2, this.sys.game.canvas.height/2, this.sys.game.canvas.width-48, this.sys.game.canvas.height-48, 0x000000);

        // Initialize game variables
        this.score = 0;
        this.isGameOver = false;
        this.direction = 'right';
        this.nextDirection = 'right';

        // Set the background color around the game area
        this.cameras.main.setBackgroundColor(0x363535);
        
        // Creates the score text and sets its position and color
        this.scoreText = this.add.text(this.sys.game.canvas.width/16, this.sys.game.canvas.height/22, 'score: ' + this.score, { fontSize: '50px', fill: '#fff' });

        // Create the snake and initialize its size
        utils.createSnake(this);

        // Create tutorial text 
        utils.tutorialText(this);

        // Spawn initial food
        utils.spawnFood(this);

        // Setup keyboard and swipe controls
        controls.setupControls(this);
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
        controls.keyboardHandler(this);

        // Move snake at fixed intervals according to the time
        if (time >= this.lastMoveTime + this.snakeSpeed) {
            utils.moveSnake(this);
            this.lastMoveTime = time;
        }
    }
}