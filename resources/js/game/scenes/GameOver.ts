import Phaser from 'phaser';
import { GameConfig } from '../GameConfig';
import { EventBus } from '../EventBus';

interface GameOverData {
    score: number;
}

export default class GameOver extends Phaser.Scene {
    private score: number = 0;
    private lastRestartTime: number = 0;
    constructor() {
        super({ key: GameConfig.STATES.GAME_OVER });
    }

    init(data: GameOverData) {
        this.score = data?.score ?? 0;
    }

    create(): void {
        const { width, height } = this.scale;
        this.add.text(width / 2, 180, 'Game Over', { fontFamily: 'Arial', fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(width / 2, 250, `Score: ${this.score}`, { fontFamily: 'Arial', fontSize: '28px', color: '#ffffff' }).setOrigin(0.5);

        const submit = this.add.text(width / 2, 340, 'Submit Score', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        const retry = this.add.text(width / 2, 390, 'Retry', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        const menu = this.add.text(width / 2, 440, 'Menu', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        let submitting = false;
        submit.on('pointerdown', () => {
            if (submitting) return;
            submitting = true;
            submit.setText('Submitting...');
            EventBus.emit('submit-score', this.score);
            this.time.delayedCall(600, () => {
                submit.setText('Submitted');
            });
        });
        
        retry.on('pointerdown', () => {
            // Prevent rapid restarts
            if (this.time.now < this.lastRestartTime + 100) return;
            this.lastRestartTime = this.time.now;

            // Properly stop current scene and start game
            this.time.delayedCall(100, () => {
                this.scene.stop(); // Stop current scene first
                this.scene.start(GameConfig.STATES.GAME);
            });
        });
        menu.on('pointerdown', () => this.scene.start(GameConfig.STATES.MAIN_MENU));

        EventBus.emit('current-scene-ready', this);
    }

    shutdown() {
        this.children.removeAll();
        EventBus.emit('scene-shutdown', this);
    }
}
