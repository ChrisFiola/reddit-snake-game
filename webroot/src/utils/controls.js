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