import styles from './Pit.module.css';

interface PitProps {
  stones: number;
  onClick: () => void;
  isFocused: boolean;
}

const Pit = (props: PitProps) => {
  return (
    <div class={`${styles.pit} ${props.isFocused ? styles.focused : ''}`} onClick={props.onClick}>
      {props.stones}
    </div>
  );
};

export default Pit;