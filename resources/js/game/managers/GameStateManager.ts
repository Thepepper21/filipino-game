import Phaser from "phaser";
import { GAME_CONSTANTS } from "./GameConstants";

export class GameStateManager {
    private scene: Phaser.Scene;
    
    // Game state
    private score: number = 0;
    private hearts: number = GAME_CONSTANTS.GAME.INITIAL_HEARTS;
    private bullBaseSpeed: number = GAME_CONSTANTS.BULL.BASE_SPEED;
    private bullSpeed: number = GAME_CONSTANTS.BULL.BASE_SPEED;
    private difficultyLevel: number = 1;
    private isGameOver: boolean = false;
    
    // Timing
    private lastCollisionTime: number = 0;
    private isInvulnerable: boolean = false;
    private lastScoreTime: number = 0;
    private lastJumpBonusTime: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    initializeState(): void {
        this.score = 0;
        this.hearts = GAME_CONSTANTS.GAME.INITIAL_HEARTS;
        this.bullSpeed = this.bullBaseSpeed;
        this.difficultyLevel = 1;
        this.isGameOver = false;
        this.isInvulnerable = false;
        this.lastCollisionTime = 0;
        this.lastScoreTime = this.scene.time.now;
        this.lastJumpBonusTime = 0;
    }

    addScore(points: number): { levelUp: boolean; newLevel: number } {
        this.score += points;

        // Check for difficulty increase
        const newLevel = Math.floor(this.score / GAME_CONSTANTS.GAME.DIFFICULTY_THRESHOLD) + 1;
        const levelUp = newLevel > this.difficultyLevel;
        
        if (levelUp) {
            this.difficultyLevel = newLevel;
            this.bullSpeed = this.bullBaseSpeed + (this.difficultyLevel - 1) * GAME_CONSTANTS.GAME.DIFFICULTY_SPEED_INCREASE;
        }

        return { levelUp, newLevel: this.difficultyLevel };
    }

    takeDamage(): boolean {
        if (this.isInvulnerable || this.isGameOver) {
            return false;
        }

        this.hearts--;
        this.isInvulnerable = true;
        this.lastCollisionTime = this.scene.time.now;

        return this.hearts <= 0; // Return true if game over
    }

    updateInvulnerability(): boolean {
        if (this.isInvulnerable && 
            this.scene.time.now - this.lastCollisionTime > GAME_CONSTANTS.GAME.INVULNERABILITY_DURATION) {
            this.isInvulnerable = false;
            return true; // Invulnerability ended
        }
        return false;
    }

    shouldAwardSurvivalPoints(): boolean {
        if (this.scene.time.now - this.lastScoreTime > GAME_CONSTANTS.GAME.SCORE_INTERVAL) {
            this.lastScoreTime = this.scene.time.now;
            return true;
        }
        return false;
    }

    canAwardJumpBonus(): boolean {
        if (this.scene.time.now - this.lastJumpBonusTime > GAME_CONSTANTS.GAME.JUMP_BONUS_COOLDOWN) {
            this.lastJumpBonusTime = this.scene.time.now;
            return true;
        }
        return false;
    }

    setGameOver(): void {
        this.isGameOver = true;
    }

    // Getters
    getScore(): number {
        return this.score;
    }

    getHearts(): number {
        return this.hearts;
    }

    getBullSpeed(): number {
        return this.bullSpeed;
    }

    getDifficultyLevel(): number {
        return this.difficultyLevel;
    }

    getIsGameOver(): boolean {
        return this.isGameOver;
    }

    getIsInvulnerable(): boolean {
        return this.isInvulnerable;
    }
}
