import Phaser from "phaser";
import { GameConfig } from "../GameConfig";
import { SpriteManager } from "./SpriteManager";
import { GameStateManager } from "./GameStateManager";
import { UIManager } from "./UIManager";
import { GAME_CONSTANTS } from "./GameConstants";

export class CollisionManager {
    private scene: Phaser.Scene;
    private spriteManager: SpriteManager;
    private gameStateManager: GameStateManager;
    private uiManager: UIManager;

    constructor(
        scene: Phaser.Scene, 
        spriteManager: SpriteManager, 
        gameStateManager: GameStateManager,
        uiManager: UIManager
    ) {
        this.scene = scene;
        this.spriteManager = spriteManager;
        this.gameStateManager = gameStateManager;
        this.uiManager = uiManager;
    }

    setupCollisions(): void {
        // Wait a frame to ensure all sprites are fully initialized
        this.scene.time.delayedCall(50, () => {
            this.initializeCollisions();
        });
    }

    private initializeCollisions(): void {
        const player = this.spriteManager.getPlayer();
        const bull = this.spriteManager.getBull();
        const ground = this.spriteManager.getGround();

        console.log(`🔧 Setting up ROBUST collision system...`);
        console.log(`👤 Player: exists=${!!player}, body=${!!player?.body}, pos=(${player?.x}, ${player?.y})`);
        console.log(`🐂 Bull: exists=${!!bull}, body=${!!bull?.body}, pos=(${bull?.x}, ${bull?.y})`);
        console.log(`🌍 Ground: exists=${!!ground}, body=${!!ground?.body}`);

        if (!player || !bull || !ground) {
            console.error(`❌ CRITICAL: Missing sprites for collision setup!`);
            throw new Error("Missing sprites - cannot setup collisions");
        }

        if (!player.body || !bull.body || !ground.body) {
            console.error(`❌ CRITICAL: Missing physics bodies for collision setup!`);
            throw new Error("Missing physics bodies - cannot setup collisions");
        }

        // Validate ground body properties
        const groundBody = ground.body as Phaser.Physics.Arcade.StaticBody;
        console.log(`🏗️ Ground validation: immovable=${groundBody.immovable}, width=${groundBody.width}, height=${groundBody.height}`);

        // Add collision with the ground platform with validation callbacks
        const playerGroundCollider = this.scene.physics.add.collider(player, ground, () => {
            // Optional: Add collision feedback for debugging
            if (Math.random() < 0.01) { // Occasional logging
                console.log(`✅ Player successfully colliding with ground`);
            }
        });

        const bullGroundCollider = this.scene.physics.add.collider(bull, ground, () => {
            // Optional: Add collision feedback for debugging
            if (Math.random() < 0.01) { // Occasional logging
                console.log(`✅ Bull successfully colliding with ground`);
            }
        });

        // Add collision between player and bull
        const playerBullCollider = this.scene.physics.add.collider(player, bull, () => {
            this.handlePlayerBullCollision();
        });

        // Validate colliders were created
        if (!playerGroundCollider || !bullGroundCollider || !playerBullCollider) {
            console.error(`❌ CRITICAL: Failed to create collision objects!`);
            throw new Error("Collision creation failed");
        }

        console.log(`✅ ROBUST collision system initialized successfully`);
        console.log(`🎯 Player-Ground collider: ${!!playerGroundCollider}`);
        console.log(`🐂 Bull-Ground collider: ${!!bullGroundCollider}`);
        console.log(`💥 Player-Bull collider: ${!!playerBullCollider}`);

        // Test collision detection after a short delay
        this.scene.time.delayedCall(100, () => {
            this.validateCollisionSystem();
        });
    }

    private validateCollisionSystem(): void {
        const player = this.spriteManager.getPlayer();
        const ground = this.spriteManager.getGround();
        
        if (player && ground && player.body && ground.body) {
            const playerBody = player.body as Phaser.Physics.Arcade.Body;
            const groundBody = ground.body as Phaser.Physics.Arcade.StaticBody;
            
            console.log(`🔍 Collision validation:`);
            console.log(`   Player Y: ${player.y}, Ground Y: ${ground.y}`);
            console.log(`   Player touching down: ${playerBody.touching.down}`);
            console.log(`   Player blocked down: ${playerBody.blocked.down}`);
            console.log(`   Ground body active: ${groundBody.enable}`);
        }
    }

    private handlePlayerBullCollision(): void {
        const isGameOver = this.gameStateManager.takeDamage();
        
        if (isGameOver) {
            this.handleGameOver();
        } else {
            // Visual feedback
            this.spriteManager.handlePlayerDamage();
            
            // Knockback effect
            this.spriteManager.applyKnockback();
            
            // Update UI
            this.uiManager.updateHearts(this.gameStateManager.getHearts());
        }
    }

    checkJumpOverBull(): void {
        if (this.spriteManager.checkJumpOverBull(this.scene) && 
            this.gameStateManager.canAwardJumpBonus()) {
            
            // Award bonus points
            const result = this.gameStateManager.addScore(GAME_CONSTANTS.GAME.JUMP_BONUS_POINTS);
            
            // Update UI
            this.uiManager.updateScore(this.gameStateManager.getScore());
            
            if (result.levelUp) {
                this.uiManager.updateDifficulty(result.newLevel);
                this.uiManager.showLevelUpEffect();
            }

            // Show bonus text
            const player = this.spriteManager.getPlayer();
            this.uiManager.showBonusText(
                player.x, 
                player.y, 
                GAME_CONSTANTS.GAME.JUMP_BONUS_POINTS
            );
        }
    }

    awardSurvivalPoints(): void {
        if (this.gameStateManager.shouldAwardSurvivalPoints()) {
            const result = this.gameStateManager.addScore(GAME_CONSTANTS.GAME.SURVIVAL_POINTS);
            
            // Update UI
            this.uiManager.updateScore(this.gameStateManager.getScore());
            
            if (result.levelUp) {
                this.uiManager.updateDifficulty(result.newLevel);
                this.uiManager.showLevelUpEffect();
            }
        }
    }

    updateInvulnerability(): void {
        if (this.gameStateManager.updateInvulnerability()) {
            // Clear damage tint when invulnerability ends
            this.spriteManager.clearPlayerTint();
        }
    }

    private handleGameOver(): void {
        this.gameStateManager.setGameOver();
        this.scene.physics.pause();

        // Stop all tweens
        this.scene.tweens.killAll();

        // Transition to game over scene
        this.scene.time.delayedCall(500, () => {
            this.scene.scene.start(GameConfig.STATES.GAME_OVER, {
                score: this.gameStateManager.getScore(),
            });
        });
    }
}
