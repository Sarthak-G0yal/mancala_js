// engine/game.ts
import {
	NUM_PITS,
	NUMBER_OF_STONES,
	SLOTS,
	STORE_1_POS,
	STORE_2_POS,
} from "./types";

import { Player, Prizes } from "./types";

/**
 * Initializes the game state with stones in each pit,
 * and empty stores for both players.
 */
export function prepareGame(): number[] {
	const gameState = Array(SLOTS).fill(NUMBER_OF_STONES);
	gameState[STORE_1_POS] = 0;
	gameState[STORE_2_POS] = 0;
	return gameState;
}

/**
 * Plays one turn for the given player.
 * @param gameState The current game state (mutated in place).
 * @param p The current player.
 * @param position The pit index (1–NUM_PITS).
 * @returns { playAgain: boolean, success: boolean }
 */
export function playTurn(
	gameState: number[],
	p: Player,
	position: number,
): { playAgain: boolean; success: boolean } {
	// Position out of bounds
	if (position < 1 || position > NUM_PITS) {
		return { playAgain: false, success: false };
	}

	// Opponent’s store should be skipped
	const ignorePosition = p === Player.PLAYER_1 ? STORE_2_POS : STORE_1_POS;

	let index = p + position - 1;
	let tempCounter = gameState[index];

	// Pit is empty → invalid move
	if (tempCounter <= 0) {
		return { playAgain: false, success: false };
	}

	// Empty the chosen pit
	gameState[index] = 0;

	// Distribute seeds
	while (tempCounter-- > 0) {
		index++;
		if (index === ignorePosition) index++;
		if (index >= SLOTS) index %= SLOTS;

		gameState[index] += 1;
	}

	// --- Special Rule 1: Capture ---
	if (index !== STORE_1_POS && index !== STORE_2_POS) {
		if (p === Player.PLAYER_1 && index < STORE_1_POS) {
			const oppositeIndex = SLOTS - index - 2;
			if (gameState[index] === 1 && gameState[oppositeIndex] !== 0) {
				gameState[STORE_1_POS] += gameState[oppositeIndex] + 1;
				gameState[index] = 0;
				gameState[oppositeIndex] = 0;
			}
		} else if (p === Player.PLAYER_2 && index > STORE_1_POS) {
			const oppositeIndex = SLOTS - index - 2;
			if (gameState[index] === 1 && gameState[oppositeIndex] !== 0) {
				gameState[STORE_2_POS] += gameState[oppositeIndex] + 1;
				gameState[index] = 0;
				gameState[oppositeIndex] = 0;
			}
		}
	}

	// --- Special Rule 2: Extra turn ---
	const playAgain =
		(p === Player.PLAYER_1 && index === STORE_1_POS) ||
		(p === Player.PLAYER_2 && index === STORE_2_POS);

	return { playAgain, success: true };
}

/**
 * Checks if both players still have seeds in their pits.
 * If either side has no seeds left, the game ends.
 */
export function canContinueToPlay(gameState: number[]): boolean {
	const seedsInPits = [0, 0];

	// Player 1 pits
	for (let i = 0; i < STORE_1_POS; i++) {
		seedsInPits[0] += gameState[i];
	}

	// Player 2 pits
	for (let i = STORE_1_POS + 1; i < STORE_2_POS; i++) {
		seedsInPits[1] += gameState[i];
	}

	// If either side has no seeds, stop the game
	return !(seedsInPits[0] === 0 || seedsInPits[1] === 0);
}

/**
 * Checks if a given pit can be played by the player.
 */
export function canPlayTurn(
	gameState: number[],
	player: Player,
	position: number,
): boolean {
	// Position out of bounds [1, NUM_PITS]
	if (position < 1 || position > NUM_PITS) {
		return false;
	}

	// Pit is empty
	if (gameState[player + position - 1] === 0) {
		return false;
	}

	return true;
}

/**
 * Finalizes the game:
 * - Collects remaining stones from pits into stores
 * - Determines the winner
 * - Returns the result as a Prize enum
 */
export function finalizeGame(gameState: number[]): Prizes {
	let player1Remaining = 0;
	let player2Remaining = 0;

	// Collect Player 1's remaining stones
	for (let i = 0; i < STORE_1_POS; i++) {
		player1Remaining += gameState[i];
		gameState[i] = 0;
	}

	// Collect Player 2's remaining stones
	for (let i = STORE_1_POS + 1; i < STORE_2_POS; i++) {
		player2Remaining += gameState[i];
		gameState[i] = 0;
	}

	// Move them into their respective stores
	gameState[STORE_1_POS] += player1Remaining;
	gameState[STORE_2_POS] += player2Remaining;

	console.log("\nGame over!");
	console.log("Final Scores:");
	console.log("Player 1:", gameState[STORE_1_POS]);
	console.log("Player 2:", gameState[STORE_2_POS]);

	if (gameState[STORE_1_POS] > gameState[STORE_2_POS]) {
		console.log("Winner: Player 1");
		return Prizes.PLAYER_1_WIN;
	} else if (gameState[STORE_2_POS] > gameState[STORE_1_POS]) {
		console.log("Winner: Player 2");
		return Prizes.PLAYER_2_WIN;
	} else {
		console.log("It's a draw");
		return Prizes.DRAW;
	}
}
