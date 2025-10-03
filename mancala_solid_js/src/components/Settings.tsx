
import { createSignal } from 'solid-js';
import styles from './Settings.module.css';

interface SettingsProps {
  onSettingsChange: (stones: number) => void;
}

const Settings = (props: SettingsProps) => {
  const [stones, setStones] = createSignal(4);

  const handleStonesChange = (e: Event) => {
    const newStones = parseInt((e.target as HTMLInputElement).value);
    setStones(newStones);
    props.onSettingsChange(newStones);
  };

  return (
    <div class={styles.settings}>
      <h2>Game Settings</h2>
      <label for="stones">Number of stones per pit:</label>
      <input 
        type="number" 
        id="stones" 
        name="stones" 
        min="1" 
        max="10" 
        value={stones()} 
        onInput={handleStonesChange} 
      />
    </div>
  );
};

export default Settings;
