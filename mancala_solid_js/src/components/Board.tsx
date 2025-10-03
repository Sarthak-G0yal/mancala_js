import { For } from 'solid-js';
import { NUM_PITS, Player, STORE_1_POS, STORE_2_POS } from '../game/types';
import Pit from './Pit';
import Store from './Store';
import styles from './Board.module.css';

interface BoardProps {
  gameState: number[];
  onPitClick: (pitIndex: number) => void;
  currentPlayer: Player;
  focusedPit: number | null;
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
      <Store stones={props.gameState[STORE_2_POS]} isFocused={props.focusedPit === STORE_2_POS} />
      <div class={styles.pitsContainer}>
        <div class={styles.pits}>
          <For each={player2Pits().reverse()}>{
            (stones, index) => {
              const pitIndex = STORE_2_POS - 1 - index();
              return <Pit stones={stones} onClick={() => handlePitClick(Player.PLAYER_2, NUM_PITS - 1 - index())} isFocused={props.focusedPit === pitIndex} />
            }
          }</For>
        </div>
        <div class={styles.pits}>
          <For each={player1Pits()}>{ (stones, index) => (
            <Pit stones={stones} onClick={() => handlePitClick(Player.PLAYER_1, index())} isFocused={props.focusedPit === index()} />
          )}</For>
        </div>
      </div>
      <Store stones={props.gameState[STORE_1_POS]} isFocused={props.focusedPit === STORE_1_POS} />
    </div>
  );
};

export default Board;