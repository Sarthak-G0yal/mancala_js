
import { Player as PlayerEnum } from '../game/types';
import styles from './Player.module.css';

interface PlayerProps {
  player: PlayerEnum;
  isCurrent: boolean;
}

const Player = (props: PlayerProps) => {
  const playerName = props.player === PlayerEnum.PLAYER_1 ? 'Player 1' : 'Player 2';
  return (
    <div class={`${styles.player} ${props.isCurrent ? styles.current : ''}`}>
      {playerName}
    </div>
  );
};

export default Player;
