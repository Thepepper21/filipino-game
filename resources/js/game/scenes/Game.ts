    create() {
        console.log('🎮 Creating Game scene');
        const width = this.scale.width;
        const height = this.scale.height;

        console.log("🎮 Game scene create() called");

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
