import { Boot } from './scenes/Boot.js';
import { Game } from './scenes/Game.js';
import { Menu } from './scenes/Menu.js';
import { Preloader } from './scenes/Preloader.js';

export const config = {
    width: 1080,
    height: 1920,
    type: Phaser.AUTO,
    autoFocus: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 500, x: 0 }
        }
    },
    transparent: true,
    scene: [
        Boot,
        Preloader,
        Menu,
        Game
    ]
};

new Phaser.Game(config);

