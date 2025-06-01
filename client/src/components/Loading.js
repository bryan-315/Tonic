import styles from '../styles/Loading.module.css'

const Loading = ({ message = 'Loading...' }) => (
    <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>{message}</p>
    </div>
);

export default Loading;
