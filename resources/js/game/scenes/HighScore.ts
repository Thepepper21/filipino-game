import Phaser from 'phaser';
import { GameConfig } from '../GameConfig';
import { getHighScore, HighScoreResponse } from '../api';

export default class HighScore extends Phaser.Scene {
    private statusText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: GameConfig.STATES.HIGH_SCORE });
    }

    async create(): Promise<void> {
        const { width } = this.scale;
        this.add.text(width / 2, 160, 'Highest Score', { fontFamily: 'Arial', fontSize: '42px', color: '#ffffff' }).setOrigin(0.5);
        this.statusText = this.add.text(width / 2, 230, 'Loading...', { fontFamily: 'Arial', fontSize: '24px', color: '#94a3b8' }).setOrigin(0.5);

        const menu = this.add.text(width / 2, 460, 'Menu', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        menu.on('pointerdown', () => this.scene.start(GameConfig.STATES.MAIN_MENU));

        try {
            const data = await getHighScore();
            this.statusText.setText(`${data.name}: ${data.score}`);
            localStorage.setItem('luksongbaka_high', JSON.stringify(data));
        } catch (e) {
            const cached = localStorage.getItem('luksongbaka_high');
            if (cached) {
                const data = JSON.parse(cached) as HighScoreResponse;
                this.statusText.setText(`${data.name}: ${data.score} (offline)`);
            } else {
                this.statusText.setText('No data (offline)');
            }
        }
    }
}


