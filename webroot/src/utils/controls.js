export function swipeGestures(scene) {

        // Adding swipe gestures for mobile
        let swipeStart = { x: 0, y: 0 };

        scene.input.on('pointerdown', (pointer) => {
            swipeStart.x = pointer.x;
            swipeStart.y = pointer.y;
        });

        scene.input.on('pointerup', (pointer) => {
            const deltaX = pointer.x - swipeStart.x;
            const deltaY = pointer.y - swipeStart.y;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    scene.nextDirection = 'right';
                } else {
                    scene.nextDirection = 'left';
                }
            } else {
                if (deltaY > 0) {
                    scene.nextDirection = 'down';
                } else {
                    scene.nextDirection = 'up';
                }
            }
        });
    }

export function keyboardControlSetup(scene) {
    // Setup keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
}

export function keyboardControlInput(scene) {
    // Handle input
    if (this.cursors.left.isDown && this.direction !== 'right') {
        this.nextDirection = 'left';
    } else if (this.cursors.right.isDown && this.direction !== 'left') {
        this.nextDirection = 'right';
    } else if (this.cursors.up.isDown && this.direction !== 'down') {
        this.nextDirection = 'up';
    } else if (this.cursors.down.isDown && this.direction !== 'up') {
        this.nextDirection = 'down';
    }
}