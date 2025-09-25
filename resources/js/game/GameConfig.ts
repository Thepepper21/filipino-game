
export const GameConfig = {
    WIDTH: 1024,
    HEIGHT: 720,
    BACKGROUND_COLOR: "#1e293b",
    STATES: {
        BOOT: "Boot",
        PRELOAD: "Preload",
        MAIN_MENU: "MainMenu",
        GAME: "Game",
        GAME_OVER: "GameOver",
        CREDITS: "Credits",
        HIGH_SCORE: "HighScore",
    },
    PHYSICS: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 1000 },
            debug: false
        }
    }
} as const;