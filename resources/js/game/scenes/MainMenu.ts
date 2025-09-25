import Phaser from 'phaser';
import { GameConfig } from '../GameConfig';
import { EventBus } from '../EventBus';

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: GameConfig.STATES.MAIN_MENU });
    }

    create(): void {
        const { width, height } = this.scale;

        this.add.text(width / 2, 120, 'Luksong Baka', { fontFamily: 'Arial', fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);

        const buttons = [
            { label: 'Start Game', onClick: () => this.scene.start(GameConfig.STATES.GAME) },
            { label: 'Highest Score', onClick: () => this.scene.start(GameConfig.STATES.HIGH_SCORE) },
            { label: 'Credits', onClick: () => this.scene.start(GameConfig.STATES.CREDITS) },
        ];

        buttons.forEach((btn, index) => {
            const y = 240 + index * 70;
            const text = this.add.text(width / 2, y, btn.label, { fontFamily: 'Arial', fontSize: '28px', color: '#ffffff' }).setOrigin(0.5).setPadding(12, 8, 12, 8).setInteractive({ useHandCursor: true });
            text.on('pointerover', () => text.setStyle({ color: '#38bdf8' }));
            text.on('pointerout', () => text.setStyle({ color: '#ffffff' }));
            text.on('pointerdown', btn.onClick);
        });

        EventBus.emit('current-scene-ready', this);
    }
}