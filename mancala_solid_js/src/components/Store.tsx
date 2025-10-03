
import styles from './Store.module.css';

interface StoreProps {
  stones: number;
}

const Store = (props: StoreProps) => {
  return (
    <div class={styles.store}>
      {props.stones}
    </div>
  );
};

export default Store;
