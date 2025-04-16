export const MagoTextStyle = {
	small: 48,
	normal: 72,
	bigger: 82,
	big: 100,
	large: 121,
	gigantic: 172,
};

export class MagoText extends Phaser.GameObjects.BitmapText {
	constructor(
		scene = Phaser.Scene,
		x = Number ,
		y = Number,
		text = String,
		fontSize = MagoTextStyle.normal,
		fontFamily = 'mago3_black'
	) {
		super(scene, x, y, fontFamily, text, fontSize);
		this.setOrigin(0.5, 0.5);
		scene.add.existing(this);
	}
}
