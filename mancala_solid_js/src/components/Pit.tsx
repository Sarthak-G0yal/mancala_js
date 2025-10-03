
import styles from './Pit.module.css';

interface PitProps {
  stones: number;
  onClick: () => void;
}

const Pit = (props: PitProps) => {
  return (
    <div class={styles.pit} onClick={props.onClick}>
      {props.stones}
    </div>
  );
};

export default Pit;
