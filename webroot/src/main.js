import { Boot } from './scenes/Boot.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { Preloader } from './scenes/Preloader.js';

const config = {
    type: Phaser.AUTO,
    autoFocus: true,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 500 }
        }
    },
    scale: {
        mode: Phaser.Scale.EXPAND,
    },
    fps: {
        target: 100,
        limit: 100,
        min: 40,
    },
    transparent: true,
    scene: [
        Boot,
        Preloader,
        Game,
        GameOver
    ]
};

new Phaser.Game(config);
