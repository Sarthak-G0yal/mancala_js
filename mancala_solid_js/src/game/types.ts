// Game constants
export const NUM_PITS = 6;
export let NUMBER_OF_STONES = 4;
export const SLOTS = NUM_PITS * 2 + 2;
export const STORE_1_POS = NUM_PITS;
export const STORE_2_POS = SLOTS - 1;
export const AI_DEPTH = 10;

// Player identifiers
export const Player = {
	PLAYER_1: 0,
	PLAYER_2: NUM_PITS + 1,
} as const;

export type Player = (typeof Player)[keyof typeof Player];

// Game outcomes
export const Prizes = {
	PLAYER_1_WIN: 1,
	PLAYER_2_WIN: -1,
	DRAW: 0,
} as const;

export type Prizes = (typeof Prizes)[keyof typeof Prizes];

// Result of a minimax/AI move
export interface MoveResult {
	score: number;
	bestPit: number; // which pit to play (1–NUM_PITS)
}

export interface TurnUpdate {
	index: number;
	stones: number;
}

export function setNumberOfStones(stones: number) {
	NUMBER_OF_STONES = stones;
}
