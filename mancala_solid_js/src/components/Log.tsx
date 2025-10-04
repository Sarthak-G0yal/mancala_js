
import styles from './Log.module.css';

interface LogProps {
  moves: string[];
}

const Log = (props: LogProps) => {
  return (
    <div class={styles.logContainer}>
      <h2>Move Log</h2>
      <ul class={styles.logList}>
        {props.moves.map((move, index) => (
          <li key={index}>{move}</li>
        ))}
      </ul>
    </div>
  );
};

export default Log;
