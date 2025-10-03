import styles from './GameMode.module.css';

export const GameModeEnum = {
  PVA: 'Player vs. AI',
  PVP: 'Player vs. Player',
} as const;

export type GameModeEnum = (typeof GameModeEnum)[keyof typeof GameModeEnum];

interface GameModeProps {
  onGameModeChange: (mode: GameModeEnum) => void;
  activeMode: GameModeEnum;
}

const GameMode = (props: GameModeProps) => {
  return (
    <div class={styles.gamemode}>
      <h2>Select Game Mode</h2>
      <button 
        onClick={() => props.onGameModeChange(GameModeEnum.PVA)} 
        class={props.activeMode === GameModeEnum.PVA ? styles.active : ''}
      >
        {GameModeEnum.PVA}
      </button>
      <button 
        onClick={() => props.onGameModeChange(GameModeEnum.PVP)} 
        class={props.activeMode === GameModeEnum.PVP ? styles.active : ''}
      >
        {GameModeEnum.PVP}
      </button>
    </div>
  );
};

export default GameMode;