
import { For } from 'solid-js';
import styles from './Log.module.css';

interface LogProps {
  moves: string[];
}

const Log = (props: LogProps) => {
  return (
    <div class={styles.logContainer}>
      <h2>Move Log</h2>
      <ul class={styles.logList}>
        <For each={props.moves}>{(move) => 
          <li>{move}</li>
        }</For>
      </ul>
    </div>
  );
};

export default Log;
