/**
 * Handles keyboard input for snake movement and avoids collision with itself.
 * @return {void}
 */
export function keyboardHandler(Game) {
    // Handle keyboard input
    if (Game.cursors.left.isDown && Game.direction !== 'right') {
        Game.nextDirection = 'left';
    } else if (Game.cursors.right.isDown && Game.direction !== 'left') {
        Game.nextDirection = 'right';
    } else if (Game.cursors.up.isDown && Game.direction !== 'down') {
        Game.nextDirection = 'up';
    } else if (Game.cursors.down.isDown && Game.direction !== 'up') {
        Game.nextDirection = 'down';
    }
}   

/**
 * Creates the snake with a starting position and size.
 * @return {void}
 */
export function createSnake(Game) {
    // Initialize snake
    Game.snake = [];
    const startX = 5;
    const startY = 5;

    // Create initial snake body (3 segments), feel free to play with it
    for (let i = 0; i < 3; i++) {
        const segment = Game.add.rectangle(
            (startX - i) * Game.gridSize,
            startY * Game.gridSize,
            Game.gridSize - 2,
            Game.gridSize - 2,
            0xFFFFFF
        );
        Game.snake.push(segment);
    }
}

/**
 * Creates the tutorial text and sets up listeners to hide it on key press or swipe.
 * @return {void}
 */
export function tutorialText(Game) {
    // Create tutorial text 
    Game.tutorialText = Game.add.text(512, 100, 'Use arrow keys or swipe to move the snake', {
        fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5);

    // Add listener for any key press to hide tutorial
    Game.input.keyboard.on('keydown', () => {
        if (Game.tutorialText.visible) {
            Game.tutorialText.setVisible(false);
        }
    });

    // Add listener for any swipe gesture to hide tutorial
    Game.input.on('pointerup', () => {
        if (Game.tutorialText.visible) {
            Game.tutorialText.setVisible(false);
        }
    });
}

/**
 * Spawns food at a random position on the grid.
 * @return {void}
 */
export function spawnFood(Game) {
    const x = Math.floor(Math.random() * (Game.sys.game.canvas.width / Game.gridSize)) * Game.gridSize;
    const y = Math.floor(Math.random() * (Game.sys.game.canvas.height / Game.gridSize)) * Game.gridSize;
    Game.food = Game.add.rectangle(x, y, Game.gridSize - 2, Game.gridSize - 2, 0xff0000);
}

/**
 * Moves the snake in the current direction and checks for collisions with walls, itself, or food.
 * @returns {void}
 */
export function moveSnake(Game) {
    // Update current direction
    Game.direction = Game.nextDirection;

    // Calculate new head position
    const head = Game.snake[0];
    let newX = head.x;
    let newY = head.y;

    switch (Game.direction) {
        case 'left':
            newX -= Game.gridSize;
            break;
        case 'right':
            newX += Game.gridSize;
            break;
        case 'up':
            newY -= Game.gridSize;
            break;
        case 'down':
            newY += Game.gridSize;
            break;
    }

    // Check for collisions with walls
    if (newX < 0.5 || newX >= Game.sys.game.canvas.width || newY < 0.5 || newY >= Game.sys.game.canvas.height) {
        gameOver(Game);
        return;
    }

    // Check for collision with self
    for (let segment of Game.snake) {
        if (newX === segment.x && newY === segment.y) {
            gameOver(Game);
            return;
        }
    }

    // Check for food collision
    const eating = newX === Game.food.x && newY === Game.food.y;

    // Move snake
    const newHead = Game.add.rectangle(newX, newY, Game.gridSize - 2, Game.gridSize - 2, 0xFFFFFF);
    Game.snake.unshift(newHead);

    if (!eating) {
        // Remove tail if not eating
        const tail = Game.snake.pop();
        tail.destroy();
    } else {
        // Spawn new food if eating
        Game.food.destroy();

        // Increment score
        Game.score += 1;

        // Update score text
        Game.scoreText.setText('score: ' + `${Game.score}`);

        spawnFood(Game);
    }
}

/**
 * Sets up keyboard and swipe controls for the game.
 * @return {void}
 */
export function setupControls(Game) {
    // Setup keyboard controls
    Game.cursors = Game.input.keyboard.createCursorKeys();

    // Adding swipe gestures for mobile
    let swipeStart = { x: 0, y: 0 };

    // When touch is detected, store the starting position
    Game.input.on('pointerdown', (pointer) => {
        swipeStart.x = pointer.x;
        swipeStart.y = pointer.y;
    });

    // Logic to choose the next direction based on swipe
    Game.input.on('pointerup', (pointer) => {
        const deltaX = pointer.x - swipeStart.x;
        const deltaY = pointer.y - swipeStart.y;

        // Check the direction of the swipe and avoid going back on itself
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && Game.direction !== 'left') {
                Game.nextDirection = 'right';
            } else if (deltaX != 0 && Game.direction !== 'right') {
                Game.nextDirection = 'left';
            }
        } else {
            if (deltaY > 0 && Game.direction !== 'up') {
                Game.nextDirection = 'down';
            } else if (deltaY != 0 && Game.direction !== 'down') {
                Game.nextDirection = 'up';
            }
        }
    });
}

/**
 * Handles the game over state, resets the game, and sends the score.
 * @returns {void}
 */
export function gameOver(Game) {
    // When isGameOver is false it means the game is still running
    if (Game.isGameOver) return;
    Game.isGameOver = true;

    // Sends the score when the game is over
    postWebViewMessage({ type: 'saveStats', data: { personal: Game.score } });

    // Reset directions
    Game.direction = 'right';
    Game.nextDirection = 'right';

    // Destroy all existing game objects
    Game.snake.forEach(segment => segment.destroy());
    Game.snake = [];
    if (Game.food) {
        Game.food.destroy();
    }

    // Show game over text
    Game.add.text(512, 384, 'GAME OVER', {
        fontFamily: 'Arial Black',
        fontSize: 64,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center'
    }).setOrigin(0.5);

    // Restart the scene after a delay
    Game.time.delayedCall(1000, () => {
        Game.scene.restart();
    });

    // Reset the score to zero
    Game.currentScore = 0;
    Game.score = 0;
    Game.scoreText.setText('score: ' + Game.score );
}

/**
 * Needed to send a message from the webview to devvit
 * @arg {WebViewMessage} msg
 * @return {void}
 */
function postWebViewMessage(msg) {
parent.postMessage(msg, '*');
}