import styles from './Pit.module.css';

interface PitProps {
  stones: number;
  onClick: () => void;
  isFocused: boolean;
  pitIndex: number;
}

const Pit = (props: PitProps) => {
  return (
    <div class={`${styles.pit} ${props.isFocused ? styles.focused : ''}`} onClick={props.onClick}>
      <div class={styles.stones}>{props.stones}</div>
      <div class={styles.pitIndex}>{props.pitIndex}</div>
    </div>
  );
};

export default Pit;