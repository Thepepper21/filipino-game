import Phaser from "phaser";
import { GAME_CONSTANTS } from "./GameConstants";

export class InputManager {
    private scene: Phaser.Scene;
    private jumpKey!: Phaser.Input.Keyboard.Key;
    private leftKey!: Phaser.Input.Keyboard.Key;
    private rightKey!: Phaser.Input.Keyboard.Key;
    private aKey!: Phaser.Input.Keyboard.Key;
    private dKey!: Phaser.Input.Keyboard.Key;
    private wKey!: Phaser.Input.Keyboard.Key;
    private upKey!: Phaser.Input.Keyboard.Key;

    private onJumpCallback?: () => void;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    setupInputKeys(onJump: () => void): void {
        this.onJumpCallback = onJump;

        // Arrow keys
        this.jumpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.leftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // WASD keys
        this.wKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.upKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        // Add jump listeners
        this.jumpKey.on("down", this.onJumpCallback);
        this.wKey.on("down", this.onJumpCallback);
        this.upKey.on("down", this.onJumpCallback);
    }

    getMovementInput(): number {
        let vx = 0;

        // Left movement
        if (this.leftKey.isDown || this.aKey.isDown) {
            vx = -GAME_CONSTANTS.PLAYER.MOVE_SPEED;
        }
        // Right movement
        if (this.rightKey.isDown || this.dKey.isDown) {
            vx = GAME_CONSTANTS.PLAYER.MOVE_SPEED;
        }

        return vx;
    }

    // Cleanup
    destroy(): void {
        // Remove event listeners
        if (this.jumpKey) {
            this.jumpKey.removeAllListeners();
        }
        if (this.leftKey) {
            this.leftKey.removeAllListeners();
        }
        if (this.rightKey) {
            this.rightKey.removeAllListeners();
        }
        if (this.aKey) {
            this.aKey.removeAllListeners();
        }
        if (this.dKey) {
            this.dKey.removeAllListeners();
        }
        if (this.wKey) {
            this.wKey.removeAllListeners();
        }
        if (this.upKey) {
            this.upKey.removeAllListeners();
        }

        // Remove all keyboard listeners from scene
        this.scene.input.keyboard.removeAllKeys(true);
    }
}
