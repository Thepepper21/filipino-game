import Phaser from "phaser";
import { GameConfig } from "../GameConfig";

export default class Preload extends Phaser.Scene {
    constructor() {
        super({ key: GameConfig.STATES.PRELOAD });
    }

    init() {
        //loading an image background
        this.add.rectangle(512, 360, 1024, 720, 0x0f172a);

        //progress bar
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        this.load.on("progress", (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //adding assets for the game
        this.load.setPath("assets");
        this.load.image("logo", "logo-here.png");
        // Core assets
        this.load.image("background", "background.png");
        this.load.spritesheet("playerIdle", "Idle.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("playerWalk", "Walk.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("playerRun", "Run.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.image("playerJump", "Jump.png");
        this.load.image("bull-right", "bull-right.png");
        this.load.image("bull-left", "bull-left.png");
    }

    create() {
        this.scene.start(GameConfig.STATES.MAIN_MENU);
    }
}
