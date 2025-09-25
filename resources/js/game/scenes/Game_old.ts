import Phaser from "phaser";
import { GameConfig } from "../GameConfig";
import { EventBus } from "../EventBus";
import { SpriteManager } from "../managers/SpriteManager";
import { UIManager } from "../managers/UIManager";
import { InputManager } from "../managers/InputManager";
import { GameStateManager } from "../managers/GameStateManager";
import { CollisionManager } from "../managers/CollisionManager";

export default class Game extends Phaser.Scene {
    // Managers
    private spriteManager!: SpriteManager;
    private uiManager!: UIManager;
    private inputManager!: InputManager;
    private gameStateManager!: GameStateManager;
    private collisionManager!: CollisionManager;

    constructor() {
        super({ key: GameConfig.STATES.GAME });
    }

    init() {
        // Initialize managers
        this.spriteManager = new SpriteManager(this);
        this.uiManager = new UIManager(this);
        this.inputManager = new InputManager(this);
        this.gameStateManager = new GameStateManager(this);
        this.collisionManager = new CollisionManager(
            this, 
            this.spriteManager, 
            this.gameStateManager, 
            this.uiManager
        );

        // Initialize game state
        this.gameStateManager.initializeState();
    }

    create(): void {
        console.log("🎮 Game scene create() called");

        const { width, height } = this.scale;

        // Ensure we start with a clean slate
        this.cleanupPreviousObjects();

        // Clear any existing physics bodies
        this.physics.world.removeAllListeners();

        // Create background
        const bg = this.add.image(width / 2, height / 2, "background");
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setScrollFactor(0);

        // Create all game objects using managers
        this.spriteManager.createSprites(width, height);
        this.spriteManager.createAnimations();
        this.uiManager.createUI();
        
        // Setup input handling
        this.inputManager.setupInputKeys(() => this.tryJump());
        
        // Setup collision system
        this.collisionManager.setupCollisions();

        console.log('✅ Game initialized with modular managers');
        EventBus.emit("current-scene-ready", this);
    }

    private setupInputKeys(): void {
        // Set up keyboard input
        this.jumpKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.leftKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.LEFT
        );
        this.rightKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.RIGHT
        );

        // Also add WASD support
        const wKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.W
        );
        this.aKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );
        this.dKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );
        const upKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.UP
        );

        // Add jump listeners
        this.jumpKey.on("down", () => this.tryJump());
        wKey.on("down", () => this.tryJump());
        upKey.on("down", () => this.tryJump());
    }

    private cleanupPreviousObjects(): void {
        console.log('🧹 Starting cleanup...');
        
        // Stop all tweens first
        this.tweens.killAll();
        
        // Remove all keyboard listeners
        this.input.keyboard.removeAllKeys(true);
        
        // Destroy all children (this includes sprites, text, etc.)
        this.children.removeAll(true);
        
        // Clear physics world and remove all bodies
        if (this.physics && this.physics.world) {
            this.physics.world.removeAllListeners();
            // Remove all physics bodies
            this.physics.world.bodies.clear();
            this.physics.world.staticBodies.clear();
        }
        
        // Reset all object references to null
        this.player = null as any;
        this.bull = null as any;
        this.ground = null as any;
        this.scoreText = null as any;
        this.heartsText = null as any;
        this.difficultyText = null as any;
        
        console.log('✅ Cleanup completed - all objects destroyed');
    }

    private tryJump(): void {
        if (this.isGameOver) return;
        const onGround =
            (this.player.body as Phaser.Physics.Arcade.Body).blocked.down ||
            (this.player.body as Phaser.Physics.Arcade.Body).touching.down;
        if (onGround) {
            this.player.setVelocityY(-520);
        }
    }

    update(): void {
        if (this.isGameOver) return;

        // Handle movement
        let vx = 0;

        // Left movement
        if (this.leftKey.isDown || this.aKey.isDown) {
            vx = -this.moveSpeed;
        }
        // Right movement
        if (this.rightKey.isDown || this.dKey.isDown) {
            vx = this.moveSpeed;
        }

        this.player.setVelocityX(vx);

        // Simple texture switching
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        const onGround = body.blocked.down || body.touching.down;

        if (!onGround) {
            this.player.anims.play("jump", true);
        } else if (vx !== 0) {
            this.player.anims.play("walk", true);
        } else {
            this.player.anims.play("idle", true);
        }

        const width = this.scale.width;
        if (this.bull.x < 100) {
            this.bullDirection = 1;
            this.bull.setFlipX(false);
        } else if (this.bull.x > width - 100) {
            this.bullDirection = -1;
            this.bull.setFlipX(true);
        }

        // Apply movement
        this.bull.setVelocityX(this.bullSpeed * this.bullDirection);

        // Update invulnerability
        if (
            this.isInvulnerable &&
            this.time.now - this.lastCollisionTime >
                this.invulnerabilityDuration
        ) {
            this.isInvulnerable = false;
            this.player.clearTint();
        }

        // Award points for survival
        if (this.time.now - this.lastScoreTime > this.scoreInterval) {
            this.addScore(1);
            this.lastScoreTime = this.time.now;
        }

        // Check if player is jumping over bull (additional points)
        this.checkJumpOverBull();

        // Flip sprite
        if (vx < 0) this.player.setFlipX(true);
        else if (vx > 0) this.player.setFlipX(false);
    }

    shutdown() {
        console.log("🛑 Game scene shutting down");

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

        // Destroy player if exists
        if (this.player) {
            if (this.player.body) {
                this.physics.world.remove(
                    this.player.body as Phaser.Physics.Arcade.Body
                );
            }
            this.player.destroy();
            this.player = null as any;
        }

        // Destroy ground
        if (this.ground) {
            if (this.ground.body) {
                this.physics.world.remove(
                    this.ground.body as Phaser.Physics.Arcade.StaticBody
                );
            }
            this.ground.destroy();
            this.ground = null as any;
        }

        // Destroy UI text
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

        if (this.bull) {
            if (this.bull.body) {
                this.physics.world.remove(
                    this.bull.body as Phaser.Physics.Arcade.Body
                );
            }
            this.bull.destroy();
            this.bull = null as any;
        }

        // Clear all children
        this.children.removeAll();

        // Reset state
        this.score = 0;
        this.hearts = 3;
        this.bullSpeed = this.bullBaseSpeed;
        this.difficultyLevel = 1;
        this.isGameOver = false;
        this.isRunning = false;
        this.isInvulnerable = false;
        this.lastCollisionTime = 0;
        this.lastScoreTime = 0;
        this.lastJumpBonusTime = 0;

        EventBus.emit("scene-shutdown", this);
    }

    private handlePlayerBullCollision(): void {
        // Don't take damage if invulnerable or game is over
        if (this.isInvulnerable || this.isGameOver) return;

        // Lose a heart
        this.hearts--;
        this.updateHeartsDisplay();

        // Set invulnerability
        this.isInvulnerable = true;
        this.lastCollisionTime = this.time.now;

        // Visual feedback - make player flash red
        this.player.setTint(0xff0000);

        // Check if game over
        if (this.hearts <= 0) {
            this.gameOver();
        } else {
            // Knockback effect
            const knockbackForce = this.player.x < this.bull.x ? -200 : 200;
            this.player.setVelocityX(knockbackForce);
        }
    }

    private addScore(points: number): void {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);

        // Check for difficulty increase every 5 points
        const newLevel = Math.floor(this.score / 5) + 1;
        if (newLevel > this.difficultyLevel) {
            this.difficultyLevel = newLevel;
            this.bullSpeed =
                this.bullBaseSpeed + (this.difficultyLevel - 1) * 50;
            this.difficultyText.setText(`Level: ${this.difficultyLevel}`);

            // Visual feedback for level up
            this.difficultyText.setTint(0x00ff00);
            this.time.delayedCall(500, () => {
                this.difficultyText.clearTint();
            });
        }
    }

    private updateHeartsDisplay(): void {
        const heartSymbols =
            "❤️".repeat(this.hearts) + "🖤".repeat(3 - this.hearts);
        this.heartsText.setText(`Hearts: ${heartSymbols}`);
    }

    private checkJumpOverBull(): void {
        // Check if player is above the bull and moving
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        const bullBody = this.bull.body as Phaser.Physics.Arcade.Body;

        // If player is in the air and horizontally aligned with bull
        if (!playerBody.touching.down && !playerBody.blocked.down) {
            const horizontalDistance = Math.abs(this.player.x - this.bull.x);
            const verticalDistance = this.bull.y - this.player.y;

            // Player is above bull and close horizontally
            if (
                horizontalDistance < 60 &&
                verticalDistance > 20 &&
                verticalDistance < 100
            ) {
                // Check cooldown to prevent multiple bonuses for same jump
                if (
                    this.time.now - this.lastJumpBonusTime >
                    this.jumpBonusCooldown
                ) {
                    this.lastJumpBonusTime = this.time.now;

                    // Award bonus points for jumping over
                    this.addScore(2);

                    // Visual feedback
                    const bonusText = this.add.text(
                        this.player.x,
                        this.player.y - 30,
                        "+2",
                        {
                            fontFamily: "Arial",
                            fontSize: "20px",
                            color: "#ffff00",
                        }
                    );

                    // Animate bonus text
                    this.tweens.add({
                        targets: bonusText,
                        y: bonusText.y - 50,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => bonusText.destroy(),
                    });
                }
            }
        }
    }

    private gameOver(): void {
        this.isGameOver = true;
        this.physics.pause();

        // Stop all tweens
        this.tweens.killAll();

        // Transition to game over scene
        this.time.delayedCall(500, () => {
            this.scene.start(GameConfig.STATES.GAME_OVER, {
                score: this.score,
            });
        });
    }
}
