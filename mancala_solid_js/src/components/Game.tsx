import { createSignal } from 'solid-js';
import {
  prepareGame,
  playTurn,
  canContinueToPlay,
  finalizeGame,
} from '../game/engine';
import { Player, Prizes } from '../game/types';
import { minimaxAB } from '../game/ai';
import Board from './Board';
import PlayerComponent from './Player';
import Settings from './Settings';
import GameMode, { GameModeEnum } from './GameMode';
import styles from './Game.module.css';

const Game = () => {
  const [numberOfStones, setNumberOfStones] = createSignal(4);
  const [gameState, setGameState] = createSignal(prepareGame(numberOfStones()));
  const [currentPlayer, setCurrentPlayer] = createSignal(Player.PLAYER_1);
  const [winner, setWinner] = createSignal<Prizes | null>(null);
  const [gameMode, setGameMode] = createSignal<GameModeEnum>(
    GameModeEnum.PVA
  );

  const handleSettingsChange = (stones: number) => {
    setNumberOfStones(stones);
    restartGame(stones);
  };

  const handleGameModeChange = (mode: GameModeEnum) => {
    setGameMode(mode);
    restartGame(numberOfStones());
  };

  const handlePitClick = (pitIndex: number) => {
    if (winner() !== null) return;

    const player = currentPlayer();

    if (gameMode() === GameModeEnum.PVA && player === Player.PLAYER_2) {
      return;
    }

    const { playAgain, success } = playTurn(gameState(), player, pitIndex + 1);
    setGameState([...gameState()]);

    if (success) {
      if (!canContinueToPlay(gameState())) {
        setWinner(finalizeGame(gameState()));
        return;
      }

      if (!playAgain) {
        const nextPlayer = player === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;
        setCurrentPlayer(nextPlayer);
        if (gameMode() === GameModeEnum.PVA && nextPlayer === Player.PLAYER_2) {
          setTimeout(aiTurn, 500);
        }
      } else if (gameMode() === GameModeEnum.PVA && player === Player.PLAYER_2) {
        setTimeout(aiTurn, 500);
      }
    }
  };

  const aiTurn = () => {
    const { bestPit } = minimaxAB(
      gameState(),
      Player.PLAYER_2,
      10,
      true,
      Player.PLAYER_2,
      -Infinity,
      Infinity
    );

    const { playAgain, success } = playTurn(gameState(), Player.PLAYER_2, bestPit);
    setGameState([...gameState()]);

    if (success) {
      if (!canContinueToPlay(gameState())) {
        setWinner(finalizeGame(gameState()));
        return;
      }

      if (playAgain) {
        aiTurn();
      } else {
        setCurrentPlayer(Player.PLAYER_1);
      }
    }
  };

  const restartGame = (stones: number) => {
    setGameState(prepareGame(stones));
    setCurrentPlayer(Player.PLAYER_1);
    setWinner(null);
  };

  return (
    <div class={styles.game}>
      <h1>Mancala</h1>
      <GameMode onGameModeChange={handleGameModeChange} activeMode={gameMode()} />
      <Settings onSettingsChange={handleSettingsChange} />
      <div class={styles.players}>
        <PlayerComponent
          player={Player.PLAYER_1}
          isCurrent={currentPlayer() === Player.PLAYER_1}
        />
        <PlayerComponent
          player={Player.PLAYER_2}
          isCurrent={currentPlayer() === Player.PLAYER_2}
        />
      </div>
      <Board
        gameState={gameState()}
        onPitClick={handlePitClick}
        currentPlayer={currentPlayer()}
      />
      {winner() !== null && (
        <div class={styles.winner}>
          {winner() === Prizes.DRAW && 'It\'s a draw!'}
          {winner() === Prizes.PLAYER_1_WIN && 'Player 1 wins!'}
          {winner() === Prizes.PLAYER_2_WIN && 'Player 2 wins!'}
          <button class={styles.button} onClick={() => restartGame(numberOfStones())}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;