
import { Prizes } from '../game/types';
import { GameModeEnum } from './GameStartPopup';
import styles from './WinnerPopup.module.css';

interface WinnerPopupProps {
  winner: Prizes | null;
  onRestart: () => void;
  gameMode: GameModeEnum;
}

const WinnerPopup = (props: WinnerPopupProps) => {
  const winnerName = () => {
    if (props.winner === Prizes.PLAYER_1_WIN) {
      return 'Player 1';
    } else if (props.winner === Prizes.PLAYER_2_WIN) {
      return props.gameMode === GameModeEnum.PVA ? 'AI' : 'Player 2';
    } else {
      return 'No one';
    }
  };

  return (
    <div class={styles.popupOverlay}>
      <div class={styles.popup}>
        <h2>Game Over</h2>
        <p>{winnerName()} wins!</p>
        <button onClick={props.onRestart}>Play Again</button>
      </div>
    </div>
  );
};

export default WinnerPopup;
