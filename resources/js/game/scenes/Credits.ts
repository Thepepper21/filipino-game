import Phaser from 'phaser';
import { GameConfig } from '../GameConfig';

export default class Credits extends Phaser.Scene {
    constructor() {
        super({ key: GameConfig.STATES.CREDITS });
    }

    create(): void {
        const { width, height } = this.scale;
        this.add.text(width / 2, 200, 'Credits', { fontFamily: 'Arial', fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(width / 2, 280, 'Developer: RJ AMBRAD', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(width / 2, 320, 'Game: Luksong Baka', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(width / 2, 360, 'Inspired by Luksong Baka', { fontFamily: 'Arial', fontSize: '24px', color: '#94a3b8' }).setOrigin(0.5);

        const menu = this.add.text(width / 2, 460, 'Menu', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        menu.on('pointerdown', () => this.scene.start(GameConfig.STATES.MAIN_MENU));
    }
}


