import Phaser from 'phaser';
import { GameConfig } from '../GameConfig';

export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: GameConfig.STATES.BOOT });
    }

    preload(): void {
        this.load.image("logo", "assets/logo-here.png");
    }

    create(): void {
        this.scene.start(GameConfig.STATES.PRELOAD);
    }
}