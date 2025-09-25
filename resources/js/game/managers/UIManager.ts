import Phaser from "phaser";
import { GAME_CONSTANTS } from "./GameConstants";

export class UIManager {
    private scene: Phaser.Scene;
    private scoreText!: Phaser.GameObjects.Text;
    private heartsText!: Phaser.GameObjects.Text;
    private difficultyText!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    createUI(): void {
        this.scoreText = this.scene.add.text(
            GAME_CONSTANTS.UI.SCORE_X,
            GAME_CONSTANTS.UI.SCORE_Y,
            "Score: 0",
            {
                fontFamily: GAME_CONSTANTS.UI.FONT_FAMILY,
                fontSize: GAME_CONSTANTS.UI.SCORE_FONT_SIZE,
                color: GAME_CONSTANTS.UI.WHITE_COLOR,
            }
        );

        this.heartsText = this.scene.add.text(
            GAME_CONSTANTS.UI.HEARTS_X,
            GAME_CONSTANTS.UI.HEARTS_Y,
            "Hearts: ❤️❤️❤️",
            {
                fontFamily: GAME_CONSTANTS.UI.FONT_FAMILY,
                fontSize: GAME_CONSTANTS.UI.HEARTS_FONT_SIZE,
                color: GAME_CONSTANTS.UI.HEARTS_COLOR,
            }
        );

        this.difficultyText = this.scene.add.text(
            GAME_CONSTANTS.UI.DIFFICULTY_X,
            GAME_CONSTANTS.UI.DIFFICULTY_Y,
            "Level: 1",
            {
                fontFamily: GAME_CONSTANTS.UI.FONT_FAMILY,
                fontSize: GAME_CONSTANTS.UI.DIFFICULTY_FONT_SIZE,
                color: GAME_CONSTANTS.UI.DIFFICULTY_COLOR,
            }
        );
    }

    updateScore(score: number): void {
        this.scoreText.setText(`Score: ${score}`);
    }

    updateHearts(hearts: number): void {
        const heartSymbols = "❤️".repeat(hearts) + "🖤".repeat(GAME_CONSTANTS.GAME.INITIAL_HEARTS - hearts);
        this.heartsText.setText(`Hearts: ${heartSymbols}`);
    }

    updateDifficulty(level: number): void {
        this.difficultyText.setText(`Level: ${level}`);
    }

    showLevelUpEffect(): void {
        // Visual feedback for level up
        this.difficultyText.setTint(GAME_CONSTANTS.COLORS.LEVEL_UP_TINT);
        this.scene.time.delayedCall(500, () => {
            this.difficultyText.clearTint();
        });
    }

    showBonusText(x: number, y: number, points: number): void {
        const bonusText = this.scene.add.text(
            x,
            y - 30,
            `+${points}`,
            {
                fontFamily: GAME_CONSTANTS.UI.FONT_FAMILY,
                fontSize: "20px",
                color: GAME_CONSTANTS.COLORS.BONUS_TEXT,
            }
        );

        // Animate bonus text
        this.scene.tweens.add({
            targets: bonusText,
            y: bonusText.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => bonusText.destroy(),
        });
    }

    // Cleanup
    destroy(): void {
        if (this.scoreText) {
            this.scoreText.destroy();
            this.scoreText = null as any;
        }
        if (this.heartsText) {
            this.heartsText.destroy();
            this.heartsText = null as any;
        }
        if (this.difficultyText) {
            this.difficultyText.destroy();
            this.difficultyText = null as any;
        }
    }
}
