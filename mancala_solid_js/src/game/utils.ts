// utils/printBoard.ts
import { NUM_PITS, STORE_1_POS, STORE_2_POS } from "./types";

/**
 * Utility to pretty-print the current game state to the console.
 */
export function printBoard(gameState: number[]): void {
	const WIDTH = 3; // width for each pit display

	// Player 2 pits (right to left)
	let topRow = "    ";
	for (let i = STORE_2_POS - 1; i > STORE_1_POS; i--) {
		topRow += String(gameState[i]).padStart(WIDTH, " ");
	}
	console.log(topRow);

	// Stores
	const middleRow =
		String(gameState[STORE_2_POS]).padStart(WIDTH, " ") +
		" ".repeat(NUM_PITS * WIDTH) +
		String(gameState[STORE_1_POS]).padStart(WIDTH, " ");
	console.log(middleRow);

	// Player 1 pits (left to right)
	let bottomRow = "    ";
	for (let i = 0; i < STORE_1_POS; i++) {
		bottomRow += String(gameState[i]).padStart(WIDTH, " ");
	}
	console.log(`${bottomRow}\n`);
}
