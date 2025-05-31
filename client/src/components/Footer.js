import { Link } from 'react-router-dom';

import styles from '../styles/Footer.module.css'


const Footer = () => (
    <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Tonic. All rights reserved.</p>
        <div className={styles.footerLinks}>
                <Link to="/" className={styles.link}>Home</Link> •{' '}
                <Link to="/about" className={styles.link}>About</Link> •{' '}
                <Link to="https://github.com/bryan-315/tonic" target="_blank" rel="noreferrer" className={styles.link}>
                GitHub
                </Link>
        </div>
        <p className={styles.builtBy}>Built by Bryan</p>
    </footer>
);

export default Footer;