import { Game } from 'phaser';
import { config } from './src/main.tsx';
import { WebviewEventManager } from './src/web/WebviewEventManager.ts'

WebviewEventManager.registerEvents()
new Game(config)
