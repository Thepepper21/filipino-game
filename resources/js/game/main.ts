
import Phaser from 'phaser';
import { GameConfig } from './GameConfig';
import Boot from './scenes/Boot';
import Preload from './scenes/Preload';
import MainMenu from './scenes/MainMenu';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';
import Credits from './scenes/Credits';
import HighScore from './scenes/HighScore';

let gameInstance: Phaser.Game | null = null;
let isCreatingGame: boolean = false;


export function ensurePhaserGame(parent: string | HTMLElement = 'game-container'): Phaser.Game {
    // If game already exists, just update the parent and return it
    if (gameInstance && gameInstance.canvas) {
        console.log('🎮 Reusing existing game instance');
        
        // Move canvas to new parent if needed
        if (typeof parent === 'string') {
            const element = document.getElementById(parent);
            if (element && gameInstance.canvas.parentElement !== element) {
                element.appendChild(gameInstance.canvas);
            }
        } else if (parent && gameInstance.canvas.parentElement !== parent) {
            parent.appendChild(gameInstance.canvas);
        }
        
        return gameInstance;
    }

    // Prevent multiple simultaneous creation
    if (isCreatingGame) {
        console.warn('Game creation already in progress');
        return gameInstance!;
    }

    console.log('🎮 Creating new game instance');
    isCreatingGame = true;

    try {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: GameConfig.WIDTH,
            height: GameConfig.HEIGHT,
            parent,
            backgroundColor: GameConfig.BACKGROUND_COLOR,
            physics: GameConfig.PHYSICS,
            scene: [Boot, Preload, MainMenu, Game, GameOver, Credits, HighScore],
        };

        gameInstance = new Phaser.Game(config);
        isCreatingGame = false;
        return gameInstance;
    } catch (error) {
        isCreatingGame = false;
        throw error;
    }
}

export function getPhaserGame(): Phaser.Game | null {
    return gameInstance;
}

export function destroyPhaserGame(): void {
    if (gameInstance) {
        gameInstance.destroy(true);
        gameInstance = null;
    }
}
