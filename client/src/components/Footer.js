//import styles from './Footer.module.css';


const Footer = () => (
    <footer className={''}>
        <p>© {new Date().getFullYear()} Tonic. All rights reserved.</p>
        <p>
            <a href="/">Home</a> •{' '}
            <a href="/about">About</a> •{' '}
            <a href="https://github.com/bryan-315/tonic" target="_blank" rel="noreferrer">
            GitHub
            </a>
        </p>
        <p className={''}>Built by Bryan</p>
        </footer>
    );

export default Footer;