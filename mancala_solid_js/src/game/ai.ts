// engine/minimaxAB.ts
import { canContinueToPlay, canPlayTurn, playTurn } from "./engine";
import {
	NUM_PITS,
	Player,
	STORE_1_POS,
	STORE_2_POS,
	type MoveResult,
} from "./types";

export function minimaxAB(
	gameState: number[],
	current: Player,
	depth: number,
	maximizing: boolean,
	aiPlayer: Player,
	alpha: number,
	beta: number,
): MoveResult {
	// Base case: game over or depth limit reached
	if (!canContinueToPlay(gameState) || depth === 0) {
		let evalScore = gameState[STORE_1_POS] - gameState[STORE_2_POS];
		if (aiPlayer === Player.PLAYER_2) evalScore = -evalScore;
		return { score: evalScore, bestPit: -1 };
	}

	let best: MoveResult = {
		score: maximizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
		bestPit: -1,
	};

	for (let pit = 1; pit <= NUM_PITS; pit++) {
		if (!canPlayTurn(gameState, current, pit)) continue;

		const { playAgain, success, states } = playTurn(gameState, current, pit);
		if (!success) continue;

        const newState = states[states.length - 1];

		const next = playAgain
			? current
			: current === Player.PLAYER_1
				? Player.PLAYER_2
				: Player.PLAYER_1;

		const result = minimaxAB(
			newState,
			next,
			depth - 1,
			next === aiPlayer,
			aiPlayer,
			alpha,
			beta,
		);

		if (maximizing) {
			if (result.score > best.score) {
				best = { score: result.score, bestPit: pit };
			}
			alpha = Math.max(alpha, best.score);
		} else {
			if (result.score < best.score) {
				best = { score: result.score, bestPit: pit };
			}
			beta = Math.min(beta, best.score);
		}

		// Alpha–beta pruning
		if (beta <= alpha) break;
	}

	// If no valid moves, just evaluate
	if (best.bestPit === -1) {
		let evalScore = gameState[STORE_1_POS] - gameState[STORE_2_POS];
		if (aiPlayer === Player.PLAYER_2) evalScore = -evalScore;
		return { score: evalScore, bestPit: -1 };
	}

	return best;
}