export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
    }

	init(){

		this.cameras.main.setBackgroundColor(0x000000);

		this.playButton = this.add.image(this.sys.game.canvas.width/2, this.sys.game.canvas.width/2, 'glass-panel')
			.setDisplaySize(719/2, 150)
			.setOrigin(0.5)
			.setInteractive({ cursor: 'pointer' })
			.once('pointerdown', () => {

				// TODO
				this.scene.start('Game');
				
			})
	}

    create() {

		this.add.existing(this.playButton);
		this.add.text(this.playButton.x, this.playButton.y, 'Play', {  fontFamily: 'Impact', fontSize: 69, color: '#FE9900',
			stroke: '#000000', strokeThickness: 5 }).setOrigin(0.5);
	}
}
