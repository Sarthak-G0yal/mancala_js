
import styles from './StonesToMove.module.css';

interface StonesToMoveProps {
  stones: number;
}

const StonesToMove = (props: StonesToMoveProps) => {
  return (
    <div class={styles.stonesToMove}>
      <div class={styles.label}>Stones to Move</div>
      <div class={styles.count}>{props.stones}</div>
    </div>
  );
};

export default StonesToMove;
