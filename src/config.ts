/** Logical game size. Phaser FIT-scales this to the browser or phone. */
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

export const PLAYER_SPEED = 340;
export const PLAYER_Y = GAME_HEIGHT - 96;
export const PLAYER_MARGIN = 42;

export const BASE_FALL_SPEED = 170;
export const FALL_SPEED_GAIN = 9;
export const MAX_FALL_SPEED = 430;

export const BASE_SPAWN_MS = 1100;
export const SPAWN_REDUCTION_PER_SEC = 20;
export const MIN_SPAWN_MS = 360;

/** Score ticks 10 times per second of survival. */
export const SCORE_TICK_MS = 100;
