import styles from './Store.module.css';

interface StoreProps {
  stones: number;
  isFocused: boolean;
}

const Store = (props: StoreProps) => {
  return (
    <div class={`${styles.store} ${props.isFocused ? styles.focused : ''}`}>
      {props.stones}
    </div>
  );
};

export default Store;