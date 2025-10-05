
import { createSignal, Show, onMount } from 'solid-js';
import {
  prepareGame,
  playTurn,
  canContinueToPlay,
  finalizeGame,
} from '../game/engine';
import { AI_DEPTH, Player, Prizes } from '../game/types';
import { minimaxAB } from '../game/ai';
import Board from './Board';
import PlayerComponent from './Player';
import Settings from './Settings';
import { GameModeEnum } from './GameStartPopup';
import WinnerPopup from './WinnerPopup';
import GameStartPopup from './GameStartPopup';
import StonesToMove from './StonesToMove';
import Log from './Log';
import styles from './Game.module.css';

const Game = () => {
  const [numberOfStones, setNumberOfStones] = createSignal(4);
  const [gameState, setGameState] = createSignal(prepareGame(numberOfStones()));
  const [currentPlayer, setCurrentPlayer] = createSignal(Player.PLAYER_1);
  const [winner, setWinner] = createSignal<Prizes | null>(null);
  const [gameMode, setGameMode] = createSignal<GameModeEnum | null>(null);
  const [focusedPit, setFocusedPit] = createSignal<number | null>(null);
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [stonesToMove, setStonesToMove] = createSignal(0);
  const [moves, setMoves] = createSignal<string[]>([]);
  const [isAiVsAiRunning, setIsAiVsAiRunning] = createSignal(false);

  const addMoveToLog = (move: string) => {
    setMoves((prevMoves) => [...prevMoves, move]);
  };

  const handleSettingsChange = (stones: number) => {
    setNumberOfStones(stones);
    restartGame();
  };

  const startGame = (mode: GameModeEnum) => {
    setGameMode(mode);
    restartGame();
  };

  const startAiVsAi = () => {
    setIsAiVsAiRunning(true);
    handleAITurn(currentPlayer());
  };

  const stopAiVsAi = () => {
    setIsAiVsAiRunning(false);
  };

  const animateTurn = (
    states: number[][],
    focusedPits: number[],
    initialStones: number,
    callback: () => void
  ) => {
    setIsAnimating(true);
    setStonesToMove(initialStones);
    let i = 0;

    function nextStep() {
      if (i >= states.length) {
        setFocusedPit(null);
        setIsAnimating(false);
        setStonesToMove(0);
        callback();
        return;
      }

      setGameState(states[i]);
      setFocusedPit(focusedPits[i]);
      if (i > 0) {
        setStonesToMove((prev) => prev - 1);
      }
      i++;

      setTimeout(nextStep, 500);
    }

    nextStep();
  };

  const handlePitClick = (pitIndex: number) => {
    if (winner() !== null || isAnimating() || gameMode() === GameModeEnum.AVA) return;

    const player = currentPlayer();

    if (gameMode() === GameModeEnum.PVA && player === Player.PLAYER_2) {
      return;
    }

    const stones = gameState()[player + pitIndex];
    addMoveToLog(`Player ${player === Player.PLAYER_1 ? 1 : 2} chose pit ${pitIndex + 1} with ${stones} stones`);

    const initialStones = gameState()[player + pitIndex];
    const { playAgain, success, states, focusedPits } = playTurn(
      gameState(),
      player,
      pitIndex + 1
    );

    if (success) {
      animateTurn(states, focusedPits, initialStones, () => {
        if (!canContinueToPlay(gameState())) {
          setWinner(finalizeGame(gameState()));
          return;
        }

        if (!playAgain) {
          const nextPlayer =
            player === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;
          setCurrentPlayer(nextPlayer);
          if (
            gameMode() === GameModeEnum.PVA &&
            nextPlayer === Player.PLAYER_2
          ) {
            setTimeout(() => handleAITurn(Player.PLAYER_2), 500);
          }
        } else if (
          gameMode() === GameModeEnum.PVA &&
          player === Player.PLAYER_2
        ) {
          setTimeout(() => handleAITurn(Player.PLAYER_2), 500);
        }
      });
    }
  };

  const handleAITurn = (player: Player) => {
    if (gameMode() === GameModeEnum.AVA && !isAiVsAiRunning()) return;

    const { bestPit } = minimaxAB(
      gameState(),
      player,
      AI_DEPTH,
      true,
      player,
      -Infinity,
      Infinity
    );

    const stones = gameState()[player + bestPit - 1];
    addMoveToLog(`AI (${player === Player.PLAYER_1 ? 1 : 2}) chose pit ${bestPit} with ${stones} stones`);

    const initialStones = gameState()[player + bestPit - 1];
    const { playAgain, success, states, focusedPits } = playTurn(
      gameState(),
      player,
      bestPit
    );

    if (success) {
      animateTurn(states, focusedPits, initialStones, () => {
        if (!canContinueToPlay(gameState())) {
          setWinner(finalizeGame(gameState()));
          return;
        }

        if (playAgain) {
          handleAITurn(player);
        } else {
          const nextPlayer =
            player === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;
          setCurrentPlayer(nextPlayer);
          if (gameMode() === GameModeEnum.AVA) {
            setTimeout(() => handleAITurn(nextPlayer), 500);
          }
        }
      });
    }
  };

  const restartGame = () => {
    setGameState(prepareGame(numberOfStones()));
    setCurrentPlayer(Player.PLAYER_1);
    setWinner(null);
    setMoves([]);
    setIsAiVsAiRunning(false);
  };

  const onRestart = () => {
    setGameMode(null);
    restartGame();
  };

  return (
    <>
      <Show when={gameMode() === null}>
        <GameStartPopup onStartGame={startGame} />
      </Show>
      <Show when={gameMode() !== null}>
        <div
          class={`${styles.game} ${
            currentPlayer() === Player.PLAYER_1
              ? styles.player1Turn
              : styles.player2Turn
          }`}
        >
          <Show when={isAnimating()}>
            <StonesToMove stones={stonesToMove()} />
          </Show>
          <h1>Mancala</h1>
          <Settings
            stones={numberOfStones()}
            onSettingsChange={handleSettingsChange}
          />
          <div class={styles.players}>
            <PlayerComponent
              player={Player.PLAYER_1}
              isCurrent={currentPlayer() === Player.PLAYER_1}
              gameMode={gameMode()!}
            />
            <PlayerComponent
              player={Player.PLAYER_2}
              isCurrent={currentPlayer() === Player.PLAYER_2}
              gameMode={gameMode()!}
            />
          </div>
          <Show when={gameMode() === GameModeEnum.AVA}>
            <div class={styles.aiControls}>
              <button onClick={startAiVsAi} disabled={isAiVsAiRunning()}>Start</button>
              <button onClick={stopAiVsAi} disabled={!isAiVsAiRunning()}>Stop</button>
            </div>
          </Show>
          <div class={styles.mainContent}>
            <Board
              gameState={gameState()}
              onPitClick={handlePitClick}
              currentPlayer={currentPlayer()}
              focusedPit={focusedPit()}
            />
            <Log moves={moves()} />
          </div>
          {winner() !== null && (
            <WinnerPopup
              winner={winner()}
              onRestart={onRestart}
              gameMode={gameMode()!}
            />
          )}
        </div>
      </Show>
    </>
  );
};

export default Game;
