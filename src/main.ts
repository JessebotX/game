import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const SCREEN_RESOLUTION_W = 1920
const SCREEN_RESOLUTION_H = 1080

// var timer = this.time.addEvent({
//     delay: 500,
//     callback: cancelIdleCallback,
//     // args: [],
//     callbackScope: thisArg,
//     loop: true,
// });

// var progress = timer.getOverallProgress();

const SCREEN_W = 2500
const SCREEN_H = 2500

// const CENTER_W = SCREEN_W / 2;
// const CENTER_H = SCREEN_H / 2;

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: SCREEN_W,
    height: SCREEN_H,
    parent: 'game-container',
    backgroundColor: '#0x000000',

    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { x: 0, y: 0 },
            debug: false
        }
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

export default new Game(config);
