
import styles from './GameStartPopup.module.css';

export const GameModeEnum = {
  PVA: 'Player vs. AI',
  PVP: 'Player vs. Player',
  AVA: 'AI vs. AI',
} as const;

export type GameModeEnum = (typeof GameModeEnum)[keyof typeof GameModeEnum];

interface GameStartPopupProps {
  onStartGame: (mode: GameModeEnum) => void;
}

const GameStartPopup = (props: GameStartPopupProps) => {
  return (
    <div class={styles.popupOverlay}>
      <div class={styles.popup}>
        <h1>Welcome to Mancala!</h1>
        <div class={styles.rules}>
          <h2>How to Play:</h2>
          <ul>
            <li>Each player has six pits and one store.</li>
            <li>Each pit starts with four stones.</li>
            <li>On your turn, pick up all stones from one of your pits and drop them counter-clockwise, one per pit.</li>
            <li>Place stones in your store but skip your opponent’s store.</li>
            <li>If your last stone lands in your store, you get another turn.</li>
            <li>If your last stone lands in an empty pit on your side, capture that stone and all stones opposite.</li>
            <li>The game ends when one player’s pits are empty; the other player takes all remaining stones.</li>
            <li>The player with the most stones in their store wins.</li>
          </ul>
        </div>
        <h2>Choose your game mode:</h2>
        <div class={styles.buttons}>
          <button onClick={() => props.onStartGame(GameModeEnum.PVP)}>
            Player vs. Player
          </button>
          <button onClick={() => props.onStartGame(GameModeEnum.PVA)}>
            Player vs. AI
          </button>
          <button onClick={() => props.onStartGame(GameModeEnum.AVA)}>
            AI vs. AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameStartPopup;
