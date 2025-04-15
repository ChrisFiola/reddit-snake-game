//import type {Types} from 'phaser';
import { Boot } from './scenes/Boot.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { Preloader } from './scenes/Preloader.js';

export const config = {
    type: Phaser.AUTO,
    autoFocus: true,
    //parent: 'game-container',
    backgroundColor: 'white',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1024,
            height: 768,
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
        Game,
        GameOver
    ]
};

new Phaser.Game(config);

