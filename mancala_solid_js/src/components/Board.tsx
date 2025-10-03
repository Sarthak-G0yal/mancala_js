import { For } from 'solid-js';
import { NUM_PITS, Player, STORE_1_POS, STORE_2_POS } from '../game/types';
import Pit from './Pit';
import Store from './Store';
import styles from './Board.module.css';

interface BoardProps {
  gameState: number[];
  onPitClick: (pitIndex: number) => void;
  currentPlayer: Player;
}

const Board = (props: BoardProps) => {
  const player1Pits = () => props.gameState.slice(0, NUM_PITS);
  const player2Pits = () => props.gameState.slice(NUM_PITS + 1, STORE_2_POS);

  const handlePitClick = (player: Player, pitIndex: number) => {
    if (player === props.currentPlayer) {
      props.onPitClick(pitIndex);
    }
  };

  return (
    <div class={styles.board}>
      <div class={styles.player2Side}>
        <Store stones={props.gameState[STORE_2_POS]} />
        <div class={styles.pits}>
          <For each={player2Pits().reverse()}>{
            (stones, index) => (
              <Pit stones={stones} onClick={() => handlePitClick(Player.PLAYER_2, NUM_PITS - 1 - index())} />
            )
          }</For>
        </div>
      </div>
      <div class={styles.player1Side}>
        <div class={styles.pits}>
          <For each={player1Pits()}>{ (stones, index) => (
            <Pit stones={stones} onClick={() => handlePitClick(Player.PLAYER_1, index())} />
          )}</For>
        </div>
        <Store stones={props.gameState[STORE_1_POS]} />
      </div>
    </div>
  );
};

export default Board;