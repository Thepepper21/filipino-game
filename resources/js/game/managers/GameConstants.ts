export const GAME_CONSTANTS = {
    // Player settings
    PLAYER: {
        MOVE_SPEED: 180,
        RUN_SPEED: 260,
        JUMP_VELOCITY: -520,
        GRAVITY: 800,
        SCALE: 2.5,
        BODY_WIDTH: 30,
        BODY_HEIGHT: 50,
        BODY_OFFSET_X: 15,
        BODY_OFFSET_Y: 25,
        SPAWN_X: 120,
    },

    // Bull settings
    BULL: {
        BASE_SPEED: 200,
        GRAVITY: 800,
        SCALE: 2.5,
        BODY_WIDTH: 40,
        BODY_HEIGHT: 50,
        BODY_OFFSET_X: 20,
        BODY_OFFSET_Y: 25,
        SPAWN_OFFSET: 500,
        BOUNDARY_OFFSET: 100,
    },

    // Game mechanics
    GAME: {
        INITIAL_HEARTS: 3,
        INVULNERABILITY_DURATION: 1000, // 1 second
        SCORE_INTERVAL: 2000, // Award points every 2 seconds
        JUMP_BONUS_COOLDOWN: 1000,
        JUMP_BONUS_POINTS: 2,
        SURVIVAL_POINTS: 1,
        DIFFICULTY_THRESHOLD: 5, // Points needed to increase difficulty
        DIFFICULTY_SPEED_INCREASE: 50,
    },

    // Visual settings
    VISUAL: {
        GRASS_SURFACE_OFFSET: 80, // Distance from bottom of screen
        GROUND_HEIGHT: 60,
        GROUND_OFFSET: 30,
        GRASS_HEIGHT: 12,
        COLLISION_PLATFORM_OFFSET: 6,
        SPAWN_HEIGHT_OFFSET: 60,
    },

    // UI settings
    UI: {
        SCORE_X: 16,
        SCORE_Y: 16,
        HEARTS_X: 16,
        HEARTS_Y: 50,
        DIFFICULTY_X: 16,
        DIFFICULTY_Y: 84,
        FONT_FAMILY: 'Arial',
        SCORE_FONT_SIZE: '24px',
        HEARTS_FONT_SIZE: '24px',
        DIFFICULTY_FONT_SIZE: '20px',
        WHITE_COLOR: '#ffffff',
        HEARTS_COLOR: '#ff6b6b',
        DIFFICULTY_COLOR: '#4ecdc4',
    },

    // Colors
    COLORS: {
        GROUND_BROWN: 0x8B4513,
        GRASS_GREEN: 0x228B22,
        COLLISION_PLATFORM: 0x000000,
        DAMAGE_TINT: 0xff0000,
        LEVEL_UP_TINT: 0x00ff00,
        BONUS_TEXT: '#ffff00',
    },

    // Jump detection
    JUMP_DETECTION: {
        HORIZONTAL_DISTANCE: 60,
        MIN_VERTICAL_DISTANCE: 20,
        MAX_VERTICAL_DISTANCE: 100,
    },
} as const;
