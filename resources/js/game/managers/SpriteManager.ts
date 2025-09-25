import Phaser from "phaser";
import { GAME_CONSTANTS } from "./GameConstants";

export class SpriteManager {
    private scene: Phaser.Scene;
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private bull!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private ground!: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.StaticBody };
    private bullDirection: number = 1;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    createSprites(width: number, height: number): void {
        const grassSurfaceY = height - GAME_CONSTANTS.VISUAL.GRASS_SURFACE_OFFSET;
        
        // Position collision platform slightly ABOVE the grass surface to ensure
        // the player lands properly on the visible grass layer
        const collisionPlatformY = grassSurfaceY + (GAME_CONSTANTS.VISUAL.GRASS_HEIGHT / 2);
        
        // Position sprites so they spawn ABOVE the collision platform
        // Account for sprite body heights to ensure they land ON the platform
        const playerBodyHeight = GAME_CONSTANTS.PLAYER.BODY_HEIGHT;
        const bullBodyHeight = GAME_CONSTANTS.BULL.BODY_HEIGHT;
        
        // Start sprites 60px above the platform so they fall and land on it
        const playerY = collisionPlatformY - playerBodyHeight - 60;
        const bullY = collisionPlatformY - bullBodyHeight - 10;
        
        console.log(`🌱 Grass surface at Y: ${grassSurfaceY}`);
        console.log(`🏗️ Collision platform at Y: ${collisionPlatformY} (adjusted for proper landing)`);
        console.log(`👤 Player spawning at Y: ${playerY} (will fall to platform)`);
        console.log(`🐂 Bull spawning at Y: ${bullY} (will fall to platform)`);
        console.log(`📏 Screen height: ${height}`);

        // Create ground and grass visuals
        this.createGroundVisuals(width, height, grassSurfaceY);

        // Create collision platform FIRST
        this.createCollisionPlatform(width, collisionPlatformY);

        // Create sprites AFTER platform is ready
        this.createPlayer(playerY);
        this.createBull(width, bullY);

        // Set up physics world bounds
        this.scene.physics.world.setBounds(0, 0, width, height);
        this.player.body.onWorldBounds = true;

        console.log('✅ All sprites created successfully');
        console.log(`🎯 Player will land on platform at Y: ${collisionPlatformY}`);
        console.log(`🐂 Bull will land on platform at Y: ${collisionPlatformY}`);
    }

    private createGroundVisuals(width: number, height: number, grassSurfaceY: number): void {
        // Visual ground (brown dirt)
        const groundY = grassSurfaceY + GAME_CONSTANTS.VISUAL.GROUND_OFFSET;
        this.scene.add.rectangle(
            width / 2, 
            groundY, 
            width, 
            GAME_CONSTANTS.VISUAL.GROUND_HEIGHT, 
            GAME_CONSTANTS.COLORS.GROUND_BROWN
        );
        
        // Visual grass layer
        this.scene.add.rectangle(
            width / 2, 
            grassSurfaceY, 
            width, 
            GAME_CONSTANTS.VISUAL.GRASS_HEIGHT, 
            GAME_CONSTANTS.COLORS.GRASS_GREEN
        );
    }

    private createCollisionPlatform(width: number, collisionPlatformY: number): void {
        // Create a ROBUST collision platform with adequate thickness
        const platformHeight = 20; // Thick enough for reliable collision detection
        
        // Create static physics platform positioned to align with visual grass surface
        this.ground = this.scene.add.rectangle(
            width / 2, 
            collisionPlatformY, 
            width, 
            platformHeight,
            GAME_CONSTANTS.COLORS.COLLISION_PLATFORM, 
            0.3 // Slightly visible for debugging
        ) as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.StaticBody };
        
        // Add physics to the ground with static body (true = static)
        this.scene.physics.add.existing(this.ground, true);
        
        // Ensure the body exists and configure it
        if (this.ground.body) {
            const groundBody = this.ground.body as Phaser.Physics.Arcade.StaticBody;
            groundBody.immovable = true;
            
            // Enable collision on all sides for robust detection
            groundBody.checkCollision.up = true;
            groundBody.checkCollision.down = true;
            groundBody.checkCollision.left = true;
            groundBody.checkCollision.right = true;
            
            // Refresh the body to ensure proper setup
            groundBody.updateFromGameObject();
            
            console.log(`🏗️ ROBUST collision platform created at Y: ${collisionPlatformY} (adjusted for grass surface alignment)`);
            console.log(`📦 Platform dimensions: ${groundBody.width}x${groundBody.height}`);
            console.log(`✅ Platform ready for collision detection`);
        } else {
            console.error(`❌ CRITICAL: Failed to create physics body for ground!`);
            throw new Error("Ground physics body creation failed");
        }
    }

    private createPlayer(playerY: number): void {
        if (!this.player) {
            console.log(`🎯 Creating player at X: ${GAME_CONSTANTS.PLAYER.SPAWN_X}, Y: ${playerY}`);
            
            this.player = this.scene.physics.add.sprite(
                GAME_CONSTANTS.PLAYER.SPAWN_X, 
                playerY, 
                "playerIdle"
            );
            
            this.player.setScale(GAME_CONSTANTS.PLAYER.SCALE);
            this.player.setCollideWorldBounds(true);
            this.player.body.setGravityY(GAME_CONSTANTS.PLAYER.GRAVITY);
            this.player.body.setSize(
                GAME_CONSTANTS.PLAYER.BODY_WIDTH, 
                GAME_CONSTANTS.PLAYER.BODY_HEIGHT
            );
            this.player.body.setOffset(
                GAME_CONSTANTS.PLAYER.BODY_OFFSET_X, 
                GAME_CONSTANTS.PLAYER.BODY_OFFSET_Y
            );
            
            // Fallback if texture doesn't exist - make it bright green and large
            if (!this.scene.textures.exists("playerIdle")) {
                console.log(`⚠️ playerIdle texture not found, using green rectangle fallback`);
                this.player.setTint(0x00ff00);
            }
            
            // Make player very visible for debugging
            this.player.setAlpha(1.0);
            this.player.setVisible(true);
            
            console.log(`✅ Player created successfully at position (${this.player.x}, ${this.player.y})`);
            console.log(`📦 Player body: width=${this.player.body.width}, height=${this.player.body.height}`);
            console.log(`🔍 Player visible: ${this.player.visible}, alpha: ${this.player.alpha}`);
            
            // Validate player collision setup
            const validation = this.validateSpriteCollision(this.player);
            if (!validation.valid) {
                console.warn(`⚠️ Player collision issues:`, validation.issues);
                console.warn(`💡 Recommendations:`, validation.recommendations);
            } else {
                console.log(`✅ Player collision validation passed`);
            }
        } else {
            console.log(`⚠️ Player already exists, skipping creation`);
        }
    }

    private createBull(width: number, bullY: number): void {
        if (!this.bull) {
            this.bull = this.scene.physics.add.sprite(
                width - GAME_CONSTANTS.BULL.SPAWN_OFFSET, 
                bullY, 
                "bull-right"
            );
            
            this.bull.setScale(GAME_CONSTANTS.BULL.SCALE);
            this.bull.setCollideWorldBounds(true);
            this.bull.body.setGravityY(GAME_CONSTANTS.BULL.GRAVITY);
            this.bull.body.setSize(
                GAME_CONSTANTS.BULL.BODY_WIDTH, 
                GAME_CONSTANTS.BULL.BODY_HEIGHT
            );
            this.bull.body.setOffset(
                GAME_CONSTANTS.BULL.BODY_OFFSET_X, 
                GAME_CONSTANTS.BULL.BODY_OFFSET_Y
            );
            
            this.bull.setFlipX(false);
        }
    }

    updateBullMovement(bullSpeed: number, screenWidth: number): void {
        // Check boundaries and change direction
        if (this.bull.x < GAME_CONSTANTS.BULL.BOUNDARY_OFFSET) {
            this.bullDirection = 1;
            this.bull.setFlipX(false);
            console.log(`🐂 Bull hit left boundary, changing direction to RIGHT`);
        } else if (this.bull.x > screenWidth - GAME_CONSTANTS.BULL.BOUNDARY_OFFSET) {
            this.bullDirection = -1;
            this.bull.setFlipX(true);
            console.log(`🐂 Bull hit right boundary, changing direction to LEFT`);
        }

        // Apply movement
        this.bull.setVelocityX(bullSpeed * this.bullDirection);
        
        // Debug logging (remove after testing)
        if (Math.random() < 0.01) { // Log occasionally to avoid spam
            console.log(`🐂 Bull at X: ${this.bull.x}, Direction: ${this.bullDirection}, Speed: ${bullSpeed}`);
        }
    }

    updatePlayerMovement(vx: number): void {
        this.player.setVelocityX(vx);

        // Handle sprite flipping
        if (vx < 0) {
            this.player.setFlipX(true);
        } else if (vx > 0) {
            this.player.setFlipX(false);
        }

        // Handle animations
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        const onGround = body.blocked.down || body.touching.down;

        // Debug ground detection occasionally
        if (Math.random() < 0.01) { // Log occasionally to avoid spam
            console.log(`👤 Player Y: ${this.player.y.toFixed(1)}, VelY: ${body.velocity.y.toFixed(1)}, OnGround: ${onGround}, Blocked: ${body.blocked.down}, Touching: ${body.touching.down}`);
        }

        if (!onGround) {
            this.player.anims.play("jump", true);
        } else if (vx !== 0) {
            this.player.anims.play("walk", true);
        } else {
            this.player.anims.play("idle", true);
        }
    }

    tryJump(): boolean {
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        const onGround = body.blocked.down || body.touching.down;
        
        if (onGround) {
            this.player.setVelocityY(GAME_CONSTANTS.PLAYER.JUMP_VELOCITY);
            return true;
        }
        return false;
    }

    checkJumpOverBull(scene: Phaser.Scene): boolean {
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
        const bullBody = this.bull.body as Phaser.Physics.Arcade.Body;

        // Check if player is in the air and horizontally aligned with bull
        if (!playerBody.touching.down && !playerBody.blocked.down) {
            const horizontalDistance = Math.abs(this.player.x - this.bull.x);
            const verticalDistance = this.bull.y - this.player.y;

            // Player is above bull and close horizontally
            if (
                horizontalDistance < GAME_CONSTANTS.JUMP_DETECTION.HORIZONTAL_DISTANCE &&
                verticalDistance > GAME_CONSTANTS.JUMP_DETECTION.MIN_VERTICAL_DISTANCE &&
                verticalDistance < GAME_CONSTANTS.JUMP_DETECTION.MAX_VERTICAL_DISTANCE
            ) {
                return true;
            }
        }
        return false;
    }

    handlePlayerDamage(): void {
        // Visual feedback - make player flash red
        this.player.setTint(GAME_CONSTANTS.COLORS.DAMAGE_TINT);
    }

    clearPlayerTint(): void {
        this.player.clearTint();
    }

    applyKnockback(): void {
        const knockbackForce = this.player.x < this.bull.x ? -200 : 200;
        this.player.setVelocityX(knockbackForce);
    }

    createAnimations(): void {
        this.scene.anims.create({
            key: "idle",
            frames: [{ key: "playerIdle" }],
            frameRate: 10,
            repeat: -1,
        });

        this.scene.anims.create({
            key: "walk",
            frames: [{ key: "playerWalk" }],
            frameRate: 10,
            repeat: -1,
        });

        this.scene.anims.create({
            key: "jump",
            frames: [{ key: "playerJump" }],
            frameRate: 6,
            repeat: 0,
        });

        // Start idle animation
        if (this.player) {
            this.player.anims.play("idle", true);
        }
    }

    // REUSABLE PLATFORM COLLISION UTILITIES
    
    /**
     * Creates a robust static platform for collision detection
     * @param x - X position (center)
     * @param y - Y position (center) 
     * @param width - Platform width
     * @param height - Platform height (recommend 20+ for reliability)
     * @param visible - Whether platform should be visible (for debugging)
     * @returns Static physics body platform
     */
    createStaticPlatform(
        x: number, 
        y: number, 
        width: number, 
        height: number = 20, 
        visible: boolean = false
    ): Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.StaticBody } {
        
        const platform = this.scene.add.rectangle(
            x, y, width, height,
            GAME_CONSTANTS.COLORS.COLLISION_PLATFORM,
            visible ? 0.3 : 0
        ) as Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.StaticBody };
        
        // Add physics
        this.scene.physics.add.existing(platform, true);
        
        if (platform.body) {
            const body = platform.body as Phaser.Physics.Arcade.StaticBody;
            body.immovable = true;
            body.checkCollision.up = true;
            body.checkCollision.down = true;
            body.checkCollision.left = true;
            body.checkCollision.right = true;
            body.updateFromGameObject();
            
            console.log(`🏗️ Platform created at (${x}, ${y}) size ${width}x${height}`);
        } else {
            throw new Error(`Failed to create platform physics body at (${x}, ${y})`);
        }
        
        return platform;
    }

    /**
     * Validates that a sprite can properly collide with platforms
     * @param sprite - The sprite to validate
     * @returns Validation result with details
     */
    validateSpriteCollision(sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): {
        valid: boolean;
        issues: string[];
        recommendations: string[];
    } {
        const issues: string[] = [];
        const recommendations: string[] = [];
        
        if (!sprite.body) {
            issues.push("Sprite has no physics body");
            recommendations.push("Ensure sprite is created with this.scene.physics.add.sprite()");
        } else {
            const body = sprite.body as Phaser.Physics.Arcade.Body;
            
            if (body.width < 10 || body.height < 10) {
                issues.push(`Body too small: ${body.width}x${body.height}`);
                recommendations.push("Use body.setSize() to set appropriate collision bounds");
            }
            
            if (!body.gravity || body.gravity.y < 100) {
                issues.push(`Low/no gravity: ${body.gravity?.y || 0}`);
                recommendations.push("Set appropriate gravity with body.setGravityY()");
            }
        }
        
        return {
            valid: issues.length === 0,
            issues,
            recommendations
        };
    }

    // Getters
    getPlayer(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this.player;
    }

    getBull(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this.bull;
    }

    getGround(): Phaser.GameObjects.Rectangle {
        return this.ground;
    }

    // Cleanup
    destroy(): void {
        if (this.player) {
            this.player.destroy();
            this.player = null as any;
        }
        if (this.bull) {
            this.bull.destroy();
            this.bull = null as any;
        }
        if (this.ground) {
            this.ground.destroy();
            this.ground = null as any;
        }
    }
}
